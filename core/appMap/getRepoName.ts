export function getNameByRepository(address: string) {
  if (typeof address === "string") {
    const splitAddress = address.split("/");
    const moduleName: any =
      splitAddress && splitAddress.length > 0
        ? splitAddress[splitAddress.length - 1]
        : null;
    const realModuleName = moduleName.replace(".git", "");
    const name =
      realModuleName.split("-")[realModuleName.split("-").length - 1];
    if (
      moduleName &&
      moduleName.endsWith(".git")
    ) {
      let packageName = `application-${realModuleName}`;
      return {
        name,
        moduleName: realModuleName,
        packageName: packageName,
      };
    } else {
      throw new Error("git地址不合法!, 仓库名称命名不规范, 请查阅地址.eg xxx");
    }
  } else {
    throw new Error("git地址不合法!");
  }
}
