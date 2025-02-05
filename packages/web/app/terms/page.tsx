import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">用户协议</h1>
        <p className="text-muted-foreground">最后更新：2025年2月5日</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>1. 服务条款</h2>
        <p>
          欢迎使用 KeyBox（以下简称"服务"）。本服务由 CS Magic（以下简称"我们"）提供。通过访问或使用我们的服务，
          您同意受本用户协议的约束。如果您不同意这些条款，请不要使用本服务。
        </p>

        <h2>2. 账户注册与安全</h2>
        <p>
          2.1 您必须注册账户才能使用某些服务功能。您同意提供准确、完整的注册信息。
        </p>
        <p>
          2.2 您负责维护您账户的安全性，包括保护您的密码和限制对您账户的访问。
        </p>
        <p>
          2.3 如发现任何未经授权使用您账户的情况，您同意立即通知我们。
        </p>

        <h2>3. 服务使用规则</h2>
        <p>
          3.1 您同意不会：
        </p>
        <ul>
          <li>以任何可能损害服务的方式使用服务</li>
          <li>尝试未经授权访问任何服务、账户或计算机系统</li>
          <li>传播恶意软件或有害数据</li>
          <li>违反任何适用的法律法规</li>
        </ul>

        <h2>4. 数据安全</h2>
        <p>
          4.1 我们采用行业标准的安全措施保护您的数据：
        </p>
        <ul>
          <li>所有环境变量都经过加密存储</li>
          <li>采用细粒度的访问控制机制</li>
          <li>定期进行安全审计和更新</li>
        </ul>
        <p>
          4.2 您理解并同意，尽管我们采取这些预防措施，但我们不能保证数据传输的绝对安全性。
        </p>

        <h2>5. 知识产权</h2>
        <p>
          5.1 服务中的所有内容，包括但不限于文本、图形、代码、界面设计等，均为我们或我们的许可方所有。
        </p>
        <p>
          5.2 未经我们明确许可，您不得复制、修改、创建衍生作品、反向工程或以其他方式尝试获取服务的源代码。
        </p>

        <h2>6. 服务变更与终止</h2>
        <p>
          6.1 我们保留随时修改或终止服务的权利，无需事先通知。
        </p>
        <p>
          6.2 我们可能会不定期更新这些条款。继续使用服务即表示您接受修改后的条款。
        </p>

        <h2>7. 责任限制</h2>
        <p>
          7.1 在法律允许的最大范围内，我们不对因使用或无法使用服务而导致的任何直接、间接、偶然、特殊或后果性损害负责。
        </p>

        <h2>8. 联系我们</h2>
        <p>
          如果您对本用户协议有任何疑问，请联系我们：
        </p>
        <p>
          邮箱：<a href="mailto:support@csmagic.com" className="text-primary hover:underline">contact@csmagic.com</a>
        </p>
      </div>

      <div className="flex items-center gap-4 pt-8">
        <Link href="/privacy" className="text-primary hover:underline">
          隐私政策
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}
