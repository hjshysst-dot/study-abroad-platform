#!/usr/bin/env node
/**
 * 30个学生测试报告
 * 留学选校平台 - 压力测试 + 详细报告
 */

const http = require('http');

const API_BASE = 'http://localhost:3001';

// 30个多样化学生数据
const STUDENTS = [
  // ========== 顶尖学霸组 ==========
  {
    name: "陈明昊",
    profile: {
      name: "陈明昊",
      school: "北京人大附中",
      gpa: "4.0/4.0 (W)",
      sat: "1580",
      act: "",
      toefl: "118",
     satMath: "800",
      satReading: "780",
      apScores: "5,5,5,5,5 (微积分BC, 物理C, 化学, 计算机, 统计)",
      gpaUnweighted: "3.98",
      gpaWeighted: "4.3",
      honors: ["USACO Platinum (全美前100)", "IMO金牌", "全国物理竞赛一等奖", "丘成桐科学奖"],
      activities: ["信息学竞赛校队队长", "社区服务100+小时", "数学夏校 (Ross)", "校乐团首席"],
      essays: "讲述从畏惧数学到热爱解决复杂问题的成长历程",
      major: "计算机科学",
      targetCountries: ["美国", "加拿大"],
      budget: "100"
    }
  },
  {
    name: "李雅琪",
    profile: {
      name: "李雅琪",
      school: "上海中学国际部",
      gpa: "4.0/4.0",
      sat: "1550",
      act: "35",
      toefl: "120",
      apScores: "5,5,5,5 (微积分BC, 生物, 化学, 物理1)",
      gpaUnweighted: "4.0",
      honors: ["英特尔国际科学与工程大赛(ISE) 三等奖", "全国生物奥赛银牌", "CTB全国赛一等奖"],
      activities: ["生物实验室研究助理", "野外生态调查志愿者", "校环保社创始人", "校刊主编"],
      essays: "探讨城市化进程与生物多样性保护的平衡",
      major: "生物",
      targetCountries: ["美国", "英国"],
      budget: "120"
    }
  },
  {
    name: "王浩宇",
    profile: {
      name: "王浩宇",
      school: "南京外国语学校",
      gpa: "3.98/4.0",
      sat: "1560",
      act: "",
      toefl: "115",
      apScores: "5,5,5,5 (宏观经济, 微观经济, 心理学, 计算机)",
      gpaUnweighted: "3.95",
      honors: ["NEC全美经济学挑战赛金奖", "FBLA商业竞赛全国第三", "商赛最佳演讲奖"],
      activities: ["学生会主席", "模拟联合国社长", "经济学夏校 (Wharton)", "商业孵化项目创始人"],
      essays: "讲述通过创业帮助农村学校的经历",
      major: "经济学/商科",
      targetCountries: ["美国", "英国", "香港"],
      budget: "100"
    }
  },
  {
    name: "张雨桐",
    profile: {
      name: "张雨桐",
      school: "深圳中学",
      gpa: "4.0/4.0",
      sat: "1570",
      act: "",
      toefl: "119",
      apScores: "5,5,5,5,5 (物理C电磁, 物理C力学, 化学, 计算机, 微积分BC)",
      gpaUnweighted: "4.0",
      honors: ["物理奥赛省队一等奖", "全国青少年科技创新大赛一等奖", "丘成桐物理奖"],
      activities: ["机器人竞赛队主力", "物理竞赛培训志愿者", "校报科学专栏作者"],
      essays: "探索量子计算的基础理论之美",
      major: "物理",
      targetCountries: ["美国", "加拿大"],
      budget: "80"
    }
  },
  {
    name: "刘子轩",
    profile: {
      name: "刘子轩",
      school: "复旦附中",
      gpa: "3.96/4.0",
      sat: "1530",
      act: "35",
      toefl: "112",
      apScores: "5,5,5 (历史, 文学, 语言)",
      gpaUnweighted: "3.9",
      honors: ["John Locke论文竞赛入围", "NYT写作赛获奖", "校内辩论赛冠军"],
      activities: ["辩论社社长", "校文学社主编", "社区阅读推广", "海外交换生 (英国)"],
      essays: "从家族移民史看中美文化融合",
      major: "历史/国际关系",
      targetCountries: ["美国", "英国"],
      budget: "100"
    }
  },

  // ========== 名校强校组 ==========
  {
    name: "Emma Zhang",
    profile: {
      name: "Emma Zhang",
      school: "上海包玉刚实验学校",
      gpa: "3.9/4.0",
      sat: "1510",
      act: "34",
      toefl: "110",
      apScores: "5,5,5 (心理学, 经济学, 英语文学)",
      gpaUnweighted: "3.85",
      honors: ["AMC前5%", "CTB全国赛", "校级学术奖"],
      activities: ["学生会副会长", "志愿者社团负责人", "足球校队", "音乐节策划"],
      essays: "通过体育运动理解团队合作与领导力",
      major: "社会学/传媒",
      targetCountries: ["美国", "英国", "澳大利亚"],
      budget: "100"
    }
  },
  {
    name: "周天宇",
    profile: {
      name: "周天宇",
      school: "杭州学军中学",
      gpa: "3.85/4.0",
      sat: "1490",
      act: "",
      toefl: "108",
      apScores: "4,4,4 (微积分BC, 计算机, 物理)",
      gpaUnweighted: "3.8",
      honors: ["信息学联赛省二等奖", "校三好学生", "数学竞赛二等奖"],
      activities: ["编程社副社长", "义工服务", "校篮球队", "科学节组织者"],
      essays: "开发校园导航App的故事",
      major: "计算机科学",
      targetCountries: ["美国", "加拿大", "新加坡"],
      budget: "80"
    }
  },
  {
    name: "Jennifer Wu",
    profile: {
      name: "Jennifer Wu",
      school: "广州华南师范大学附中",
      gpa: "3.88/4.0",
      sat: "1500",
      act: "",
      toefl: "115",
      apScores: "5,5,4 (生物, 化学, 微积分AB)",
      gpaUnweighted: "3.85",
      honors: ["生物奥赛省一等奖", "AMCdistinction", "校科研创新奖"],
      activities: ["生物研究项目 (基因编辑)", "医学预科社创始人", "校舞蹈队", "科学营助教"],
      essays: "目睹外婆患病后对医学研究的执着",
      major: "医学预科/生物",
      targetCountries: ["美国", "英国", "加拿大"],
      budget: "120"
    }
  },
  {
    name: "陈浩然",
    profile: {
      name: "陈浩然",
      school: "武汉外国语学校",
      gpa: "3.8/4.0",
      sat: "1480",
      act: "33",
      toefl: "107",
      apScores: "4,4,4 (经济学, 心理学, 统计学)",
      gpaUnweighted: "3.75",
      honors: ["NEC经济学挑战赛银奖", "校辩论赛最佳辩手", "模拟联合国代表"],
      activities: ["模拟联合国秘书长", "经济学社社长", "支教志愿者 (云南)", "校报编辑"],
      essays: "从模拟联合国到真实社会问题的关注",
      major: "政治学/国际关系",
      targetCountries: ["美国", "英国", "香港"],
      budget: "80"
    }
  },
  {
    name: "Lisa Chen",
    profile: {
      name: "Lisa Chen",
      school: "成都外国语学校",
      gpa: "3.92/4.0",
      sat: "1520",
      act: "",
      toefl: "113",
      apScores: "5,5,5,4 (微积分BC, 物理C, 化学, 计算机)",
      gpaUnweighted: "3.9",
      honors: ["Physics Bowl全国前15%", "AMC前1%", "校数学竞赛冠军"],
      activities: ["数学竞赛队队长", "STEM女童权益倡导", "校机器人队工程师", "社区数学家教"],
      essays: "作为女生在理工领域的探索与坚持",
      major: "工程",
      targetCountries: ["美国", "加拿大"],
      budget: "100"
    }
  },

  // ========== 中等偏上组 ==========
  {
    name: "Michael Liu",
    profile: {
      name: "Michael Liu",
      school: "天津实验中学",
      gpa: "3.7/4.0",
      sat: "1450",
      act: "",
      toefl: "105",
      apScores: "4,4 (经济学, 心理学)",
      gpaUnweighted: "3.65",
      honors: ["校三好学生", "数学竞赛三等奖", "英语演讲比赛二等奖"],
      activities: ["学生会干事", "篮球队成员", "校志愿者社团", "环保项目发起人"],
      essays: "通过环保项目找到自己的社会责任感",
      major: "环境科学",
      targetCountries: ["美国", "澳大利亚"],
      budget: "70"
    }
  },
  {
    name: "Sophie Wang",
    profile: {
      name: "Sophie Wang",
      school: "西安高新一中",
      gpa: "3.75/4.0",
      sat: "1430",
      act: "32",
      toefl: "103",
      apScores: "4,3,3 (艺术史, 心理学, 英语)",
      gpaUnweighted: "3.7",
      honors: ["艺术比赛省级二等奖", "校优秀学生干部", "舞蹈考级十级"],
      activities: ["校舞蹈团团长", "美术社创始人", "校报美编", "博物馆志愿者"],
      essays: "用艺术连接不同文化的旅程",
      major: "艺术/设计",
      targetCountries: ["美国", "英国"],
      budget: "100"
    }
  },
  {
    name: "Jason Zhang",
    profile: {
      name: "Jason Zhang",
      school: "重庆南开中学",
      gpa: "3.6/4.0",
      sat: "1400",
      act: "",
      toefl: "100",
      apScores: "3,3 (计算机, 微积分AB)",
      gpaUnweighted: "3.5",
      honors: ["信息学联赛省三等奖", "校优秀学生", "足球比赛冠军"],
      activities: ["校足球队队长", "编程俱乐部成员", "社区服务", "动漫社成员"],
      essays: "足球场上的团队精神延伸到学术追求",
      major: "计算机科学",
      targetCountries: ["美国", "澳大利亚"],
      budget: "60"
    }
  },
  {
    name: "Emily Huang",
    profile: {
      name: "Emily Huang",
      school: "苏州外国语学校",
      gpa: "3.82/4.0",
      sat: "1470",
      act: "",
      toefl: "108",
      apScores: "5,4,4 (微观经济, 宏观经济, 统计学)",
      gpaUnweighted: "3.78",
      honors: ["NEC银奖", "CTB入选", "校优秀干部"],
      activities: ["经济学社副社长", "商业挑战赛队员", "校合唱团成员", "国际交流活动志愿者"],
      essays: "从家庭小生意看中国商业文化",
      major: "商科",
      targetCountries: ["美国", "英国", "香港"],
      budget: "90"
    }
  },
  {
    name: "Ryan Li",
    profile: {
      name: "Ryan Li",
      school: "青岛二中国际部",
      gpa: "3.65/4.0",
      sat: "1380",
      act: "30",
      toefl: "98",
      apScores: "3,3 (物理, 化学)",
      gpaUnweighted: "3.55",
      honors: ["校级物理竞赛二等奖", "海军夏令营优秀学员", "社区义工证书"],
      activities: ["校乐队吉他手", "社区图书馆志愿者", "游泳队成员", "科学俱乐部成员"],
      essays: "科学实验失败后重新站起来的故事",
      major: "化学/材料科学",
      targetCountries: ["美国", "加拿大"],
      budget: "70"
    }
  },

  // ========== 国际部/美高背景 ==========
  {
    name: "Kevin Park",
    profile: {
      name: "Kevin Park",
      school: "北京德威英国国际学校",
      gpa: "3.9/4.0",
      sat: "1490",
      act: "",
      toefl: " waived (母语水平)",
      apScores: "5,5,5 (历史, 经济, 英语文学)",
      gpaUnweighted: "3.88",
      honors: ["Ivy League Essay Competition Winner", "MUN Best Delegate", "校学术奖"],
      activities: ["学生会主席", "模拟联合国创始团队", "商业夏校 (LBS)", "社区服务负责人"],
      essays: "多元文化背景下的身份认同探索",
      major: "商科/经济学",
      targetCountries: ["美国", "英国", "香港", "新加坡"],
      budget: "120"
    }
  },
  {
    name: "Grace Kim",
    profile: {
      name: "Grace Kim",
      school: "上海协和双语学校",
      gpa: "3.78/4.0",
      sat: "1440",
      act: "",
      toefl: "110",
      apScores: "4,4,4 (心理学, 社会学, 艺术)",
      gpaUnweighted: "3.7",
      honors: ["学生会优秀干部", "艺术展最佳作品奖", "社区贡献奖"],
      activities: ["学生会副会长", "艺术社创始人", "慈善音乐会组织者", "时装设计爱好者"],
      essays: "通过时装设计表达文化多样性",
      major: "艺术/时尚管理",
      targetCountries: ["美国", "英国", "意大利"],
      budget: "100"
    }
  },
  {
    name: "Alex Wang",
    profile: {
      name: "Alex Wang",
      school: "美国Westlake High School (美高)",
      gpa: "3.95/4.0 (美高)",
      sat: "1520",
      act: "",
      toefl: " waived",
      apScores: "5,5,5,5 (微积分BC, 物理, 化学, 计算机)",
      gpaUnweighted: "3.93",
      honors: ["National Honor Society", "AP Scholar with Distinction", "校数学队主力"],
      activities: ["数学竞赛队", "校游泳队", "计算机俱乐部创始人", "医院志愿者"],
      essays: "从中国到美国找到学术热情",
      major: "计算机科学",
      targetCountries: ["美国"],
      budget: "100"
    }
  },
  {
    name: "Emily Chen",
    profile: {
      name: "Emily Chen",
      school: "香港国际学校",
      gpa: "3.85/4.0",
      sat: "1460",
      act: "",
      toefl: "112",
      apScores: "5,4,4 (经济学, 心理学, 计算机)",
      gpaUnweighted: "3.8",
      honors: ["Hong Kong Academic Competition Honor", "校优秀学生"],
      activities: ["学生会干部", "创业俱乐部", "金融实习 (投行)", "慈善跑组织者"],
      essays: "香港金融中心成长经历对商业兴趣的启发",
      major: "金融/商科",
      targetCountries: ["美国", "英国", "香港", "新加坡"],
      budget: "120"
    }
  },
  {
    name: "Brian Tan",
    profile: {
      name: "Brian Tan",
      school: "Singapore International School",
      gpa: "3.88/4.0",
      sat: "1500",
      act: "",
      toefl: "115",
      apScores: "5,5,5 (数学, 物理, 化学)",
      gpaUnweighted: "3.85",
      honors: ["Singapore Math Olympiad Silver", "National Science Fair", "校学术之星"],
      activities: ["数学竞赛队", "机器人俱乐部", "青年科学家计划", "社区服务"],
      essays: "用数学思维解决现实问题的热情",
      major: "数学/计算机",
      targetCountries: ["美国", "英国", "新加坡", "加拿大"],
      budget: "80"
    }
  },

  // ========== 特殊背景组 ==========
  {
    name: "David Wu",
    profile: {
      name: "David Wu",
      school: "湖南省重点中学",
      gpa: "3.5/4.0",
      sat: "1350",
      act: "",
      toefl: "95",
      apScores: "无AP",
      gpaUnweighted: "3.4",
      honors: ["全国信息学联赛二等奖", "省级三好学生", "数学奥赛省三"],
      activities: ["信息学竞赛队", "科技创新大赛", "校ACM队", "家教兼职"],
      essays: "从大山里的学校到信息学的世界",
      major: "计算机科学",
      targetCountries: ["美国", "加拿大"],
      budget: "50"
    }
  },
  {
    name: "Amanda Liu",
    profile: {
      name: "Amanda Liu",
      school: "普通高中 (非重点)",
      gpa: "3.7/4.0",
      sat: "1420",
      act: "",
      toefl: "102",
      apScores: "4,4 (经济学, 心理学)",
      gpaUnweighted: "3.65",
      honors: ["校英语演讲比赛冠军", "作文竞赛一等奖", "校三好学生"],
      activities: ["英语角创始人", "文学社编辑", "社区图书馆志愿者", "校园广播站主播"],
      essays: "在普通高中找到自己的声音",
      major: "新闻传播/传媒",
      targetCountries: ["美国", "澳大利亚", "英国"],
      budget: "60"
    }
  },
  {
    name: "Vincent Zhang",
    profile: {
      name: "Vincent Zhang",
      school: "武汉英中",
      gpa: "3.6/4.0",
      sat: "1390",
      act: "30",
      toefl: "99",
      apScores: "3,3,3 (商科, 经济)",
      gpaUnweighted: "3.5",
      honors: ["商赛二等奖", "创业大赛入围", "校创新奖"],
      activities: ["创业社创始人", "家族企业实习", "足球社", "商业案例分析大赛"],
      essays: "传承与创新：家族制造业的数字化转型",
      major: "工商管理",
      targetCountries: ["美国", "英国", "澳大利亚"],
      budget: "80"
    }
  },
  {
    name: "Rachel Ho",
    profile: {
      name: "Rachel Ho",
      school: "马来西亚国际学校",
      gpa: "3.8/4.0",
      sat: "1440",
      act: "",
      toefl: "110",
      apScores: "4,4,4 (生物, 化学, 心理学)",
      gpaUnweighted: "3.75",
      honors: ["生物奥赛铜奖", "环境项目获奖", "校优秀学生"],
      activities: ["环境保护组织志愿者", "生物研究小组", "弦乐团成员", "国际义工 (巴厘岛)"],
      essays: "热带雨林考察之旅与环保使命",
      major: "环境科学/生物",
      targetCountries: ["美国", "澳大利亚", "英国"],
      budget: "70"
    }
  },
  {
    name: "Daniel Kim",
    profile: {
      name: "Daniel Kim",
      school: "韩国国际学校",
      gpa: "3.72/4.0",
      sat: "1410",
      act: "",
      toefl: "106",
      apScores: "4,4 (音乐理论, 历史)",
      gpaUnweighted: "3.65",
      honors: ["韩国国家音乐比赛获奖", "校年度人物", "作曲比赛入围"],
      activities: ["校乐团指挥", "音乐创作", "音乐治疗志愿者", "多元文化社团"],
      essays: "用音乐跨越语言和文化的障碍",
      major: "音乐/艺术",
      targetCountries: ["美国", "英国", "澳大利亚"],
      budget: "90"
    }
  },

  // ========== 低分高能组 (软实力强) ==========
  {
    name: "Lucas Yang",
    profile: {
      name: "Lucas Yang",
      school: "郑州外国语学校",
      gpa: "3.4/4.0",
      sat: "1320",
      act: "",
      toefl: "92",
      apScores: "无AP",
      gpaUnweighted: "3.3",
      honors: ["全国创业大赛金奖", "挑战杯科技竞赛一等奖", "多项专利"],
      activities: ["科技公司实习", "创业公司联合创始人", "发明专利3项", "创业社群组织者"],
      essays: "从一次失败的产品到服务10万用户的App",
      major: "创业学/计算机",
      targetCountries: ["美国", "新加坡"],
      budget: "60"
    }
  },
  {
    name: "Mia Zhang",
    profile: {
      name: "Mia Zhang",
      school: "普通高中",
      gpa: "3.55/4.0",
      sat: "1300",
      act: "28",
      toefl: "90",
      apScores: "无AP",
      gpaUnweighted: "3.45",
      honors: ["全国舞蹈大赛金奖", "校艺术之星", "社会实践活动优秀"],
      activities: ["舞蹈团团长", "艺术教育公益", "校文艺汇演组织", "服装设计自学"],
      essays: "用舞蹈讲述中国传统文化之美",
      major: "艺术管理/舞蹈",
      targetCountries: ["美国", "英国", "澳大利亚"],
      budget: "70"
    }
  },
  {
    name: "Chris Lee",
    profile: {
      name: "Chris Lee",
      school: "厦门双十中学",
      gpa: "3.3/4.0",
      sat: "1280",
      act: "",
      toefl: "88",
      apScores: "无AP",
      gpaUnweighted: "3.2",
      honors: ["NCAA运动员资格", "校篮球MVP", "社区服务证书"],
      activities: ["校篮球队队长", "运动训练与康复", "体育解说志愿者", "健身俱乐部组织"],
      essays: "运动场上的领导力与永不放弃",
      major: "体育管理/运动科学",
      targetCountries: ["美国", "澳大利亚"],
      budget: "60"
    }
  },

  // ========== 文科/艺术组 ==========
  {
    name: "Jessica Wang",
    profile: {
      name: "Jessica Wang",
      school: "南京金陵中学",
      gpa: "3.9/4.0",
      sat: "1500",
      act: "",
      toefl: "115",
      apScores: "5,5,5 (英语文学, 历史, 艺术史)",
      gpaUnweighted: "3.88",
      honors: ["纽约时报写作赛获奖", "ACTI作文赛特等奖", "文学杂志发表作品"],
      activities: ["文学社社长", "校刊主编", "创意写作工坊", "国际交流生"],
      essays: "用文字记录城市化进程中消失的老街",
      major: "英语文学/创意写作",
      targetCountries: ["美国", "英国", "爱尔兰"],
      budget: "80"
    }
  },
  {
    name: "Anthony Chen",
    profile: {
      name: "Anthony Chen",
      school: "北京四中",
      gpa: "3.75/4.0",
      sat: "1460",
      act: "",
      toefl: "110",
      apScores: "5,4,4 (历史, 政治, 经济)",
      gpaUnweighted: "3.7",
      honors: ["John Locke论文竞赛入围", "模拟联合国最佳代表", "哲学论文发表"],
      activities: ["哲学社创始人", "辩论队", "法律实习 (律所)", "人文讲座组织"],
      essays: "从苏格拉底到中国法治现代化的思考",
      major: "哲学/政治学",
      targetCountries: ["美国", "英国"],
      budget: "100"
    }
  }
];

async function callAPI(profile) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ profile, applicationType: 'regular' });
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/generate-report',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error('JSON parse error: ' + body));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('='.repeat(80));
  console.log('🎓 留学选校平台 - 30个学生测试报告');
  console.log('='.repeat(80));
  console.log();

  const results = [];

  for (let i = 0; i < STUDENTS.length; i++) {
    const student = STUDENTS[i];
    const num = i + 1;
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📋 学生 ${num}/30: ${student.name}`);
    console.log('='.repeat(80));
    console.log(`🏫 高中: ${student.profile.school}`);
    console.log(`📊 GPA: ${student.profile.gpa}`);
    console.log(`📝 SAT: ${student.profile.sat} | ACT: ${student.profile.act || 'N/A'}`);
    console.log(`🌐 TOEFL: ${student.profile.toefl}`);
    console.log(`📚 AP: ${student.profile.apScores}`);
    console.log(`🏆 荣誉: ${student.profile.honors.join(', ')}`);
    console.log(`🎯 专业方向: ${student.profile.major}`);
    console.log(`🌍 申请国家: ${student.profile.targetCountries.join(', ')}`);
    console.log(`💰 预算: $${student.profile.budget}万`);
    console.log();

    try {
      const result = await callAPI(student.profile);
      
      if (result.success && result.data) {
        const data = result.data;
        console.log('✅ API调用成功!');
        console.log(`📈 综合分数: ${data.scoreBreakdown.totalScore}分`);
        if (data.hotMajorType) {
          console.log(`🔥 热门专业: ${data.hotMajorType}`);
        }
        console.log(`💡 策略建议: ${data.strategy.overall}`);
        console.log();
        console.log('🎯 冲刺学校 (Reach):');
        data.reach.forEach((s, idx) => {
          console.log(`   ${idx+1}. ${s.shortName} (${s.name}) - 录取概率: ${s.admissionProbability}% [Rank ${s.rank}] ${s.type}`);
        });
        console.log();
        console.log('✅ 匹配学校 (Match):');
        data.match.forEach((s, idx) => {
          console.log(`   ${idx+1}. ${s.shortName} (${s.name}) - 录取概率: ${s.admissionProbability}% [Rank ${s.rank}] ${s.type}`);
        });
        console.log();
        console.log('🛡️ 保底学校 (Safety):');
        data.safety.forEach((s, idx) => {
          console.log(`   ${idx+1}. ${s.shortName} (${s.name}) - 录取概率: ${s.admissionProbability}% [Rank ${s.rank}] ${s.type}`);
        });

        results.push({
          num,
          name: student.name,
          school: student.profile.school,
          gpa: student.profile.gpa,
          sat: student.profile.sat,
          toefl: student.profile.toefl,
          major: student.profile.major,
          targetCountries: student.profile.targetCountries.join(', '),
          totalScore: data.scoreBreakdown.totalScore,
          hotMajorType: data.hotMajorType || '普通',
          reachCount: data.stats.reachCount,
          matchCount: data.stats.matchCount,
          safetyCount: data.stats.safetyCount,
          topReach: data.reach[0] ? `${data.reach[0].shortName} (${data.reach[0].admissionProbability}%)` : 'N/A',
          topMatch: data.match[0] ? `${data.match[0].shortName} (${data.match[0].admissionProbability}%)` : 'N/A',
          topSafety: data.safety[0] ? `${data.safety[0].shortName} (${data.safety[0].admissionProbability}%)` : 'N/A',
          success: true
        });
      } else {
        console.log(`❌ API返回错误: ${result.error}`);
        results.push({
          num,
          name: student.name,
          success: false,
          error: result.error
        });
      }
    } catch (err) {
      console.log(`❌ 请求失败: ${err.message}`);
      results.push({
        num,
        name: student.name,
        success: false,
        error: err.message
      });
    }

    // 每个学生间隔500ms，避免请求过快
    await new Promise(r => setTimeout(r, 500));
  }

  // 输出汇总表
  console.log('\n');
  console.log('='.repeat(80));
  console.log('📊 30个学生测试结果汇总表');
  console.log('='.repeat(80));
  console.log();
  console.log('| # | 姓名 | 高中 | GPA | SAT | TOEFL | 专业 | 综合分 | 冲刺 | 匹配 | 保底 | 最佳冲刺 | 最佳匹配 |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|---|');

  results.forEach(r => {
    if (r.success) {
      console.log(`| ${r.num} | ${r.name} | ${r.school.substring(0, 12)} | ${r.gpa.substring(0, 10)} | ${r.sat} | ${r.toefl.substring(0, 6)} | ${r.major.substring(0, 8)} | ${r.totalScore} | ${r.reachCount} | ${r.matchCount} | ${r.safetyCount} | ${r.topReach} | ${r.topMatch} |`);
    } else {
      console.log(`| ${r.num} | ${r.name} | - | - | - | - | - | ❌ ${r.error} |`);
    }
  });

  console.log('\n✅ 测试完成! 共测试', results.length, '个学生');
  
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  console.log(`   成功: ${successCount} | 失败: ${failCount}`);
}

main().catch(console.error);
