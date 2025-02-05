import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">隐私政策</h1>
        <p className="text-muted-foreground">最后更新：2025年2月5日</p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <h2>1. 信息收集</h2>
        <p>
          我们收集的信息包括：
        </p>
        <ul>
          <li>
            <strong>账户信息</strong>：电子邮件地址、密码哈希等注册信息
          </li>
          <li>
            <strong>使用数据</strong>：您如何使用我们的服务，包括访问日志、功能使用情况等
          </li>
          <li>
            <strong>环境变量</strong>：您存储在我们平台上的环境变量（经过加密）
          </li>
          <li>
            <strong>设备信息</strong>：浏览器类型、操作系统、IP地址等技术信息
          </li>
        </ul>

        <h2>2. 信息使用</h2>
        <p>
          我们使用收集的信息：
        </p>
        <ul>
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的请求和响应您的询问</li>
          <li>发送服务相关通知和更新</li>
          <li>检测和防止欺诈或滥用行为</li>
          <li>进行数据分析以改善用户体验</li>
        </ul>

        <h2>3. 数据安全</h2>
        <p>
          我们采取多层次的安全措施保护您的数据：
        </p>
        <ul>
          <li>所有数据传输使用 TLS 加密</li>
          <li>环境变量使用高强度加密算法存储</li>
          <li>实施严格的访问控制和认证机制</li>
          <li>定期进行安全审计和漏洞扫描</li>
          <li>遵循行业最佳实践和安全标准</li>
        </ul>

        <h2>4. 数据共享</h2>
        <p>
          我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：
        </p>
        <ul>
          <li>经您明确同意</li>
          <li>与您所在团队的授权成员共享</li>
          <li>遵守法律要求或保护权利</li>
          <li>服务提供商（仅限必要的处理操作）</li>
        </ul>

        <h2>5. 您的权利</h2>
        <p>
          关于您的个人信息，您有权：
        </p>
        <ul>
          <li>访问您的个人数据</li>
          <li>更正不准确的数据</li>
          <li>要求删除您的数据</li>
          <li>限制或反对数据处理</li>
          <li>导出您的数据</li>
        </ul>

        <h2>6. Cookie 使用</h2>
        <p>
          我们使用 Cookie 和类似技术来：
        </p>
        <ul>
          <li>保持您的登录状态</li>
          <li>记住您的偏好设置</li>
          <li>提供安全的认证体验</li>
          <li>分析服务使用情况</li>
        </ul>

        <h2>7. 隐私政策更新</h2>
        <p>
          我们可能会不时更新本隐私政策。重大变更时，我们会通过电子邮件或网站通知通知您。继续使用我们的服务即表示您同意更新后的隐私政策。
        </p>

        <h2>8. 联系我们</h2>
        <p>
          如果您对我们的隐私政策有任何疑问或建议，请联系我们：
        </p>
        <p>
          邮箱：<a href="mailto:support@csmagic.com" className="text-primary hover:underline">privacy@csmagic.com</a>
        </p>
      </div>

      <div className="flex items-center gap-4 pt-8">
        <Link href="/terms" className="text-primary hover:underline">
          用户协议
        </Link>
        <span className="text-muted-foreground">•</span>
        <Link href="/" className="text-primary hover:underline">
          返回首页
        </Link>
      </div>
    </div>
  );
}
