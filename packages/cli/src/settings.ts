import chalk from "chalk";

export const API_URL = process.env.KEYBOX_API_URL || process.env.NEXT_PUBLIC_APP_URL || "https://keybox.cs-magic.cn"
export const PORT = 45678;
console.log(chalk.gray(`Using API URL: ${API_URL}, PORT: ${PORT}`));

