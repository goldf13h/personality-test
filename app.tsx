const { useMemo, useState } = React;

type Dim = "empathy" | "control" | "drive" | "identity";
type Dir = "ling" | "mo";

type Question = {
  id: number;
  dim: Dim;
  dir: Dir;
  text: string;
  answer: number | null;
};

const SCALE = [
  { value: 1, text: "非常不同意" },
  { value: 2, text: "不同意" },
  { value: 3, text: "中立" },
  { value: 4, text: "同意" },
  { value: 5, text: "非常同意" }
];

const initialQuestions: Question[] = [
  { id: 1, dim: "empathy", dir: "ling", text: "我会优先理解他人的情绪动机，再处理冲突。", answer: null },
  { id: 2, dim: "empathy", dir: "ling", text: "即使赶时间，我也在意关系是否长期可持续。", answer: null },
  { id: 3, dim: "empathy", dir: "mo", text: "只要目标清晰，我愿先拿结果再修复关系。", answer: null },
  { id: 4, dim: "control", dir: "ling", text: "我偏好按计划推进，并在关键节点复盘风险。", answer: null },
  { id: 5, dim: "control", dir: "mo", text: "面对不确定，我更相信临场反应而非固定流程。", answer: null },
  { id: 6, dim: "control", dir: "ling", text: "压力越大，我越重视底线规则和边界。", answer: null },
  { id: 7, dim: "drive", dir: "mo", text: "阻力越强，我越倾向主动加速突破。", answer: null },
  { id: 8, dim: "drive", dir: "mo", text: "为了关键成果，我愿意承受争议与不理解。", answer: null },
  { id: 9, dim: "drive", dir: "ling", text: "我更看重长期稳定胜过短期爆发。", answer: null },
  { id: 10, dim: "identity", dir: "mo", text: "即使多数人不认同，我也会坚持自己的价值判断。", answer: null },
  { id: 11, dim: "identity", dir: "ling", text: "我认可系统协作比单点英雄更可持续。", answer: null },
  { id: 12, dim: "identity", dir: "mo", text: "我乐于打破旧框架来证明自我。", answer: null }
];

function App() {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [submitted, setSubmitted] = useState(false);
  const [showAd, setShowAd] = useState(true);

  const answered = useMemo(() => questions.filter(q => q.answer !== null).length, [questions]);
  const allDone = answered === questions.length;

  const scoreData = useMemo(() => {
    let ling = 0;
    let mo = 0;
    const dim: Record<Dim, number> = { empathy: 0, control: 0, drive: 0, identity: 0 };

    questions.forEach(q => {
      if (q.answer === null) return;
      const v = q.answer;
      const lingAdd = q.dir === "ling" ? v : 6 - v;
      const moAdd = q.dir === "mo" ? v : 6 - v;
      ling += lingAdd;
      mo += moAdd;
      dim[q.dim] += moAdd - lingAdd;
    });

    return { ling, mo, max: questions.length * 5, dim, diff: mo - ling };
  }, [questions]);

  const result = useMemo(() => {
    if (scoreData.diff >= 8) {
      return {
        type: "魔丸型",
        cls: "mo",
        summary: "你偏向主动出击和高驱动突破，擅长在压力下开路。",
        advice: [
          "重大决策加入“二次确认”机制，降低冲动成本。",
          "推进任务时增加共情表达，提升协作稳定性。",
          "把目标拆成阶段里程碑，避免系统过载。"
        ]
      };
    }
    if (scoreData.diff <= -8) {
      return {
        type: "灵珠型",
        cls: "ling",
        summary: "你偏向稳定协作与共情，擅长构建长期可持续关系。",
        advice: [
          "在关键节点采用“70%信息即可决策”策略。",
          "清晰表达个人边界，避免过度承担。",
          "将秩序优势沉淀为流程模板，扩大影响力。"
        ]
      };
    }
    return {
      type: "灵魔平衡型",
      cls: "mix",
      summary: "你能在稳定与突破之间切换，具备较强情境适配能力。",
      advice: [
        "记录“何时稳、何时冲”最有效，形成决策地图。",
        "高压场景先定边界，再选推进节奏。",
        "在跨团队项目中发挥你的整合优势。"
      ]
    };
  }, [scoreData.diff]);

  const dimName: Record<Dim, string> = {
    empathy: "共情-关系维度",
    control: "稳定-自控维度",
    drive: "行动-突破维度",
    identity: "自我-价值维度"
  };

  const pick = (id: number, value: number) => {
    setQuestions(prev => prev.map(q => (q.id === id ? { ...q, answer: value } : q)));
  };

  const submit = () => {
    if (!allDone) {
      alert("请完成所有题目后再生成报告。");
      return;
    }
    setSubmitted(true);
  };

  const reset = () => {
    setQuestions(initialQuestions.map(q => ({ ...q, answer: null })));
    setSubmitted(false);
  };

  return (
    <div className="layout">
      <div>
        <section className="card hero">
          <h1>灵珠 / 魔丸人格测评（Conceptual Sketch）</h1>
          <p className="subtitle">专业中立视角 · 丰富问卷维度 · 仅作自我反思参考（非临床诊断）。</p>
          <div className="note">“灵珠”代表稳定协作与共情导向；“魔丸”代表独立突破与行动导向。两者都可以发展为成熟人格优势。</div>
        </section>

        <section className="card quiz">
          <h2>问卷（12题）</h2>
          <p className="progress">作答进度：{answered} / {questions.length}</p>

          {questions.map(q => (
            <article className="question" key={q.id}>
              <p className="q-title">{q.id}. {q.text}</p>
              <div className="opts">
                {SCALE.map(s => (
                  <label className="opt" key={s.value}>
                    <input
                      type="radio"
                      name={`q${q.id}`}
                      checked={q.answer === s.value}
                      onChange={() => pick(q.id, s.value)}
                    />
                    {s.text}
                  </label>
                ))}
              </div>
            </article>
          ))}

          <div className="btns">
            <button className="btn-main" onClick={submit}>生成报告</button>
            <button className="btn-sub" onClick={reset}>重置问卷</button>
          </div>

          {submitted && (
            <section className="report">
              <span className={`badge ${result.cls}`}>人格倾向：{result.type}</span>
              <p>{result.summary}</p>

              <div className="metrics">
                <div className="metric">
                  <strong>灵珠总分：</strong>{scoreData.ling} / {scoreData.max}
                  <div className="bar"><div className="fill" style={{ width: `${(scoreData.ling / scoreData.max) * 100}%` }} /></div>
                </div>
                <div className="metric">
                  <strong>魔丸总分：</strong>{scoreData.mo} / {scoreData.max}
                  <div className="bar"><div className="fill" style={{ width: `${(scoreData.mo / scoreData.max) * 100}%` }} /></div>
                </div>
              </div>

              <h3>维度趋势（正值偏魔丸，负值偏灵珠）</h3>
              <ul>
                {(Object.keys(scoreData.dim) as Dim[]).map(k => (
                  <li key={k}>{dimName[k]}：{scoreData.dim[k] > 0 ? "+" : ""}{scoreData.dim[k]}</li>
                ))}
              </ul>

              <h3>发展建议</h3>
              <ul>
                {result.advice.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </section>
          )}
        </section>
      </div>

      <aside className="sticky">
        <section className="card side">
          <div className="ad">
            <small>广告 · 心理成长合作位</small>
            <h3>人格成长训练营（90天）</h3>
            <p>按测评分维输出成长计划、行为打卡和复盘模板。</p>
            <a href="#" aria-label="查看广告详情">查看详情</a>
          </div>
          <p className="ad-note">广告位保留：支持课程、品牌、咨询服务等商业投放。</p>
        </section>
      </aside>

      {showAd && (
        <div className="modal">
          <div className="modal-card">
            <small>开屏广告 · Sponsored</small>
            <h3>领取《高压决策心理手册》</h3>
            <p>完成测评后可获得“灵珠型/魔丸型”专属决策模板。</p>
            <div className="btns">
              <button className="btn-main" onClick={() => setShowAd(false)}>我知道了</button>
              <button className="btn-sub" onClick={() => setShowAd(false)}>关闭广告</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
