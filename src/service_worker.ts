let onAuthRequiredHandler;

// https://developer.chrome.com/docs/extensions/reference/api/proxy
async function setProxy(enabled, proxy) {
  try {
    console.log("Updating proxy configuration", enabled, proxy);

    if (!enabled) {
      chrome.action.setIcon({ path: "/icons/disabled-24.png" });
      await chrome.proxy.settings.clear({});

      // Check if proxies were actually removed, in Kiwi Browser, "clear" might not yield the correct result
      const current = await chrome.proxy.settings.get({});
      if (current.value.mode === "fixed_servers") {
        await chrome.proxy.settings.set({
          value: {
            mode: "system",
          },
          scope: "regular",
        });
      }

      return;
    }

    chrome.action.setIcon({ path: "/icons/icon-24.png" });

    const url = new URL(proxy);
    const scheme = url.protocol.replace(":", "");
    const port = url.port
      ? parseInt(url.port, 10)
      : scheme === "https"
        ? 443
        : scheme === "http"
          ? 80
          : undefined;

    if (onAuthRequiredHandler)
      chrome.webRequest.onAuthRequired.removeListener(onAuthRequiredHandler);

    if (url.username && url.password && scheme.startsWith("http")) {
      console.log("Setting onAuthRequired handler");

      onAuthRequiredHandler = (details, callbackFn) => {
        console.log("onAuthRequired", details, url.username, url.password);

        if (!details.isProxy) {
          callbackFn();
          return;
        }

        callbackFn({
          authCredentials: {
            username: url.username,
            password: url.password,
          },
        });
      };

      chrome.webRequest.onAuthRequired.addListener(
        onAuthRequiredHandler,
        { urls: ["<all_urls>"] },
        ["asyncBlocking"],
      );
    }

    await chrome.proxy.settings.set({
      value: {
        mode: "fixed_servers",
        rules: {
          singleProxy: {
            scheme,
            port,
            host: url.hostname,
          },
        },
      },
      scope: "regular",
    });
  } catch (error) {
    console.error("There was some error updating proxy configuration", error);
  }
}

async function reload() {
  const data = await chrome.storage.session.get(["enabled", "proxy"]);
  await setProxy(Boolean(data.enabled), data.proxy);
}

chrome.storage.onChanged.addListener(async (changes, namespace) => {
  reload();
});

reload();
