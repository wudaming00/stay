import Link from "next/link";
import PageShell from "@/components/PageShell";

export const metadata = {
  title: "Stay — 在你说不出口的时候，有人在",
  description:
    "免费的 AI 倾诉空间。当你在崩溃边缘、当你在熬夜想说点什么、当你不知道怎么对那个人开口——Stay 帮你听见自己。免费、加密、不留服务器记录。",
  robots: { index: true, follow: true },
  alternates: { canonical: "/zh" },
  openGraph: {
    title: "Stay — 在你说不出口的时候，有人在",
    description:
      "免费的 AI 倾诉空间。加密、私密、永远免费。不会推送通知、不会让你上瘾、不会卖你的数据。",
  },
};

export default function ZhPage() {
  return (
    <PageShell>
      <article className="mx-auto w-full max-w-2xl flex-1 px-5 py-12 prose-stay sm:px-6 sm:py-16">
        <h1>在你说不出口的时候，有人在。</h1>
        <p>
          很多次让我们后悔的事情，发生在感受和说出口之间的那十分钟。
        </p>
        <p className="!mb-6">
          冲动发出去的微信。半夜两点的那条短信。家庭聚餐上脱口而出的话。
          看起来是清醒的判断、其实是疲惫做的决定。
        </p>

        <p className="!mb-0 !text-xl !leading-normal !text-foreground !italic">
          Stay 是给那十分钟的。
        </p>

        <h2>它是什么</h2>
        <p>
          Stay 是一个免费的 AI——
          在你不能、或者不该一个人扛的时候可以聊聊。它会听你说话，
          帮你找到你真正在感受的、和你真正想说的话。然后让你走。
        </p>
        <p>
          它不是治疗师。它不是你的朋友。它是另一种安静的存在——
          一个可以在做出无法挽回的事之前，先想清楚的地方。
        </p>

        <h2>它做了哪些设计上的选择</h2>
        <ul>
          <li>
            <strong>永远免费</strong>。不收用户的钱，不放广告，不卖数据——
            技术上也卖不了，因为我们看不见你说的话（端到端加密在你的设备上）。
          </li>
          <li>
            <strong>不上瘾</strong>。没有连续打卡、没有徽章、没有推送通知。
            如果你聊完心情好了、几周不来——那它就做对了。
          </li>
          <li>
            <strong>家暴友好</strong>：浏览器标签页的标题是中性的"Notes"——
            旁边有人扫一眼看不到任何心理健康相关的字。右上角有一键退出按钮，
            按 Esc 也行。可以设置一个"暗号"——打出来就立即清除一切并跳转到
            搜索引擎。
          </li>
          <li>
            <strong>有底线</strong>：当对话进入危机区域，
            会推荐受过训练的人工热线，不会假装自己能替代。
          </li>
        </ul>

        <h2>能聊些什么</h2>
        <ul>
          <li>今天工作上的某件事让你不舒服，但你说不清楚为什么</li>
          <li>和家人/伴侣吵架了，想理清自己到底在难受什么</li>
          <li>想给那个人发条信息，但每次草稿都越写越糟</li>
          <li>夜里特别难受，没有人可以打电话</li>
          <li>你担心你身边的人——朋友、伴侣、孩子——但不知道怎么帮</li>
          <li>什么都不想说，只是想有人在</li>
        </ul>

        <h2>如果你现在就在危机里</h2>
        <p>
          如果你在想结束自己的生命、或者在危险的处境里——请直接联系受过训练的人：
        </p>
        <ul>
          <li>
            <strong>北京心理危机研究与干预中心</strong>{" "}
            <a href="tel:01082951332">010-82951332</a> — 24 小时，免费，全国可拨
          </li>
          <li>
            <strong>全国希望24热线</strong>{" "}
            <a href="tel:4001619995">400-161-9995</a> — 24 小时，匿名
          </li>
          <li>
            <strong>妇联反家暴维权</strong>{" "}
            <a href="tel:12338">12338</a> — 全国，工作时间
          </li>
          <li>
            <strong>报警 / 急救</strong>{" "}
            <a href="tel:110">110</a> / <a href="tel:120">120</a> — 立即危险
          </li>
        </ul>
        <p>
          Stay 在他们旁边、不在他们之上。需要专业的，请打专业的。
          需要有个人在的、需要把话理清楚的，再回来 Stay。
        </p>

        <hr />

        <div className="!mt-12 flex justify-center">
          <Link
            href="/"
            className="inline-block rounded-md border border-accent bg-accent px-5 py-3 font-sans text-sm text-background no-underline transition-colors hover:bg-accent-hover"
          >
            开始聊聊 →
          </Link>
        </div>

        <p className="!mt-6 !text-center !text-sm !text-foreground-secondary">
          可以直接用中文打字。Stay 会用中文回。
        </p>
      </article>
    </PageShell>
  );
}
