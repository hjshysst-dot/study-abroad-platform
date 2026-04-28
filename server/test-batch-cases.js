/**
 * 留学选校平台 - 批量测试脚本
 * 生成30个本科 + 30个研究生测试案例，模拟真实用户
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const API_URL = 'http://localhost:3001/api/generate-report';

// 本科申请测试用例（30个）- 模拟真实中国学生
const undergradCases = [
  // === 高分段 (85+分) - 5个 ===
  { name: '张明轩', school: '北京人大附中', gpa: '4.0', sat: '1560', toefl: '115', ap: '8门', major: '计算机科学', desc: '海淀名校,CS竞赛金牌' },
  { name: '李雨桐', school: '上海中学国际部', gpa: '3.95', sat: '1540', toefl: '112', ap: '6门', major: '经济学', desc: '商赛冠军,学生会主席' },
  { name: '王思远', school: '南京外国语学校', gpa: '3.9', sat: '1520', toefl: '110', ap: '5门', major: '生物', desc: 'iGEM金奖,实验室经历' },
  { name: '陈晓蕾', school: '广州华南师范大学附中', gpa: '3.85', sat: '1480', toefl: '108', ap: '4门', major: '心理学', desc: '心理学论文发表' },
  { name: '刘子豪', school: '武汉英中学校', gpa: '3.92', sat: '1500', toefl: '110', ap: '7门', major: '数学', desc: 'AMC前5%,数学奥赛金牌' },
  
  // === 中高分段 (75-85分) - 10个 ===
  { name: '黄子涵', school: '成都外国语学校', gpa: '3.78', sat: '1450', toefl: '105', ap: '4门', major: '市场营销', desc: '学生会干部,商业实习' },
  { name: '周雨萱', school: '杭州外国语学校', gpa: '3.72', sat: '1420', toefl: '102', ap: '3门', major: '传媒', desc: '校报主编,新媒体运营' },
  { name: '吴俊豪', school: '苏州中学', gpa: '3.65', sat: '1380', toefl: '100', ap: '3门', major: '机械工程', desc: '机器人社团,竞赛获奖' },
  { name: '郑雅婷', school: '重庆南开中学', gpa: '3.8', sat: '1440', toefl: '105', ap: '4门', major: '国际关系', desc: '模拟联合国,志愿者' },
  { name: '孙浩然', school: '西安交通大学附中', gpa: '3.55', sat: '1360', toefl: '98', ap: '2门', major: '电子工程', desc: '科技创客,专利' },
  { name: '赵诗涵', school: '深圳中学', gpa: '3.7', sat: '1400', toefl: '100', ap: '3门', major: '艺术设计', desc: '作品集获奖,艺术特长' },
  { name: '周锦程', school: '青岛二中', gpa: '3.62', sat: '1370', toefl: '95', ap: '2门', major: '化学', desc: '化学竞赛省一' },
  { name: '杨紫悦', school: '天津耀华中学', gpa: '3.75', sat: '1430', toefl: '103', ap: '3门', major: '历史', desc: '历史课题研究' },
  { name: '陈逸凡', school: '济南山大附中', gpa: '3.58', sat: '1350', toefl: '95', ap: '2门', major: '物理', desc: '物理竞赛省二' },
  { name: '林晓峰', school: '福州一中', gpa: '3.68', sat: '1390', toefl: '98', ap: '3门', major: '数据科学', desc: '数据分析项目' },
  
  // === 中分段 (65-75分) - 10个 ===
  { name: '马子萱', school: '郑州外国语学校', gpa: '3.5', sat: '1320', toefl: '90', ap: '2门', major: '金融', desc: '银行实习' },
  { name: '朱志远', school: '长沙雅礼中学', gpa: '3.45', sat: '1300', toefl: '88', ap: '1门', major: '土木工程', desc: '社会实践' },
  { name: '胡雅静', school: '昆明三中', gpa: '3.55', sat: '1340', toefl: '92', ap: '2门', major: '英语', desc: '英语竞赛获奖' },
  { name: '张志杰', school: '哈尔滨三中', gpa: '3.4', sat: '1280', toefl: '85', ap: '1门', major: '计算机科学', desc: '编程基础' },
  { name: '刘佳欣', school: '沈阳东北育才', gpa: '3.52', sat: '1310', toefl: '90', ap: '2门', major: '生物', desc: '生物实验' },
  { name: '李明辉', school: '长春吉大附中', gpa: '3.48', sat: '1290', toefl: '88', ap: '1门', major: '材料科学', desc: '实验室经历' },
  { name: '王丽娜', school: '石家庄一中', gpa: '3.42', sat: '1270', toefl: '85', ap: '1门', major: '教育学', desc: '支教经历' },
  { name: '陈家伟', school: '太原五中', gpa: '3.38', sat: '1250', toefl: '82', ap: '1门', major: '社会学', desc: '社会调研' },
  { name: '杨帆', school: '兰州西北附中', gpa: '3.5', sat: '1300', toefl: '90', ap: '2门', major: '环境科学', desc: '环保项目' },
  { name: '许志鹏', school: '南昌二中', gpa: '3.35', sat: '1240', toefl: '80', ap: '1门', major: '机械工程', desc: '工程实习' },
  
  // === 低分段 (60-65分) - 5个 ===
  { name: '邓伟强', school: '南宁三中', gpa: '3.2', sat: '1180', toefl: '75', ap: '0门', major: '计算机科学', desc: '普通高中' },
  { name: '谭玲', school: '贵阳一中', gpa: '3.1', sat: '1150', toefl: '72', ap: '0门', major: '市场营销', desc: '成绩一般' },
  { name: '蔡明', school: '海口中学', gpa: '3.0', sat: '1120', toefl: '70', ap: '0门', major: '酒店管理', desc: '普通学生' },
  { name: '彭浩', school: '拉萨中学', gpa: '3.15', sat: '1200', toefl: '78', ap: '0门', major: '经济学', desc: '偏远地区' },
  { name: '曾伟', school: '呼和浩特附中', gpa: '3.25', sat: '1220', toefl: '80', ap: '1门', major: '法律', desc: '普通成绩' },
];

// 研究生申请测试用例（30个）- 模拟真实中国学生
const gradCases = [
  // === CS/工科 (10个) ===
  { name: '陈伟', school: '清华大学', gpa: '3.8', gre: '328', toefl: '108', major: '计算机科学', desc: 'CS本科,有论文' },
  { name: '刘芳', school: '上海交通大学', gpa: '3.7', gre: '322', toefl: '105', major: '人工智能', desc: 'AI方向,有项目' },
  { name: '张明', school: '浙江大学', gpa: '3.6', gre: '318', toefl: '100', major: '软件工程', desc: '有实习' },
  { name: '王磊', school: '中国科学技术大学', gpa: '3.5', gre: '315', toefl: '98', major: '数据科学', desc: '统计背景' },
  { name: '李华', school: '哈尔滨工业大学', gpa: '3.4', gre: '312', toefl: '95', major: '机械工程', desc: '有项目' },
  { name: '赵强', school: '同济大学', gpa: '3.3', gre: '310', toefl: '92', major: '土木工程', desc: '普通成绩' },
  { name: '孙静', school: '西安电子科技大学', gpa: '3.2', gre: '308', toefl: '90', major: '电子工程', desc: '成绩偏低' },
  { name: '周涛', school: '北京航空航天大学', gpa: '3.9', gre: '335', toefl: '110', major: '航空工程', desc: '高GPA' },
  { name: '吴婷', school: '东南大学', gpa: '3.55', gre: '320', toefl: '100', major: '生物医学工程', desc: '研究经历' },
  { name: '郑浩', school: '华中科技大学', gpa: '3.45', gre: '315', toefl: '98', major: '光电信息', desc: '工科背景' },
  
  // === 商科 (10个) ===
  { name: '钱琳', school: '北京大学', gpa: '3.7', gre: '325', toefl: '108', major: '金融', desc: '金融本科,有实习' },
  { name: '孙悦', school: '复旦大学', gpa: '3.6', gre: '320', toefl: '105', major: '市场营销', desc: '商科背景' },
  { name: '林峰', school: '南京大学', gpa: '3.5', gre: '318', toefl: '102', major: '会计', desc: '有CPA基础' },
  { name: '何雪', school: '中山大学', gpa: '3.4', gre: '315', toefl: '98', major: 'MBA', desc: '有工作经验' },
  { name: '许晴', school: '厦门大学', gpa: '3.3', gre: '312', toefl: '95', major: '商业分析', desc: '数据分析背景' },
  { name: '冯勇', school: '对外经济贸易大学', gpa: '3.8', gre: '328', toefl: '105', major: '金融工程', desc: '高GPA,实习' },
  { name: '曹雪', school: '上海财经大学', gpa: '3.55', gre: '322', toefl: '102', major: '经济学', desc: '经济学本科' },
  { name: '彭磊', school: '中央财经大学', gpa: '3.45', gre: '318', toefl: '100', major: '管理学', desc: '管理背景' },
  { name: '蒋明', school: '中国人民大学', gpa: '3.65', gre: '325', toefl: '105', major: '风险管理', desc: '金融实习' },
  { name: '卢洁', school: '武汉大学', gpa: '3.35', gre: '310', toefl: '95', major: '国际商务', desc: '普通成绩' },
  
  // === 文科/社科 (10个) ===
  { name: '范伟', school: '北京大学', gpa: '3.6', gre: '320', toefl: '110', major: '法律', desc: '法学本科' },
  { name: '史敏', school: '复旦大学', gpa: '3.5', gre: '318', toefl: '105', major: '新闻传播', desc: '新闻学背景' },
  { name: '丁力', school: '南京大学', gpa: '3.4', gre: '315', toefl: '102', major: '社会学', desc: '社会学本科' },
  { name: '梁慧', school: '浙江大学', gpa: '3.3', gre: '310', toefl: '100', major: '教育学', desc: '教育背景' },
  { name: '唐杰', school: '中山大学', gpa: '3.7', gre: '322', toefl: '105', major: '心理学', desc: '心理学背景' },
  { name: '廖华', school: '四川大学', gpa: '3.2', gre: '305', toefl: '95', major: '历史', desc: '历史本科' },
  { name: '高健', school: '山东大学', gpa: '3.55', gre: '318', toefl: '100', major: '政治学', desc: '政治学背景' },
  { name: '夏琳', school: '吉林大学', gpa: '3.45', gre: '315', toefl: '98', major: '英语', desc: '英语文学' },
  { name: '顾伟', school: '厦门大学', gpa: '3.3', gre: '310', toefl: '95', major: '哲学', desc: '哲学背景' },
  { name: '鲁静', school: '南开大学', gpa: '3.6', gre: '320', toefl: '102', major: '社会工作', desc: '社工背景' },
];

async function testCase(profile, type) {
  const startTime = Date.now();
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile, applicationType: type })
    });
    const data = await response.json();
    const elapsed = Date.now() - startTime;
    
    if (data.success && data.data) {
      const r = data.data;
      return {
        success: true,
        name: profile.name,
        major: profile.major,
        type,
        score: r.scoreBreakdown.totalScore,
        reachCount: r.reach.length,
        matchCount: r.match.length,
        safetyCount: r.safety.length,
        topReach: r.reach.slice(0, 3).map(s => s.shortName + '(' + s.admissionProbability + '%)').join(', '),
        elapsed
      };
    } else {
      return { success: false, name: profile.name, error: data.error || 'Unknown error' };
    }
  } catch (e) {
    return { success: false, name: profile.name, error: e.message };
  }
}

async function runTests() {
  console.log('🚀 开始批量测试 - 留学选校平台');
  console.log('=' .repeat(60));
  
  const results = { undergrad: [], grad: [] };
  
  // 测试本科
  console.log('\\n📚 测试本科申请 (30个案例)');
  console.log('-'.repeat(60));
  
  for (let i = 0; i < undergradCases.length; i++) {
    const tc = undergradCases[i];
    process.stdout.write(`  [${i+1}/30] ${tc.name} (${tc.major})... `);
    const result = await testCase(tc, 'undergrad');
    results.undergrad.push(result);
    if (result.success) {
      console.log(`分数:${result.score} | 冲刺:${result.reachCount} | 匹配:${result.matchCount} | 保底:${result.safetyCount} | ${result.elapsed}ms`);
    } else {
      console.log(`❌ ${result.error}`);
    }
  }
  
  // 测试研究生
  console.log('\\n🎓 测试研究生申请 (30个案例)');
  console.log('-'.repeat(60));
  
  for (let i = 0; i < gradCases.length; i++) {
    const tc = gradCases[i];
    process.stdout.write(`  [${i+1}/30] ${tc.name} (${tc.major})... `);
    const result = await testCase(tc, 'grad');
    results.grad.push(result);
    if (result.success) {
      console.log(`分数:${result.score} | 冲刺:${result.reachCount} | 匹配:${result.matchCount} | 保底:${result.safetyCount} | ${result.elapsed}ms`);
    } else {
      console.log(`❌ ${result.error}`);
    }
  }
  
  // 汇总报告
  console.log('\\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  
  const calcStats = (arr) => {
    const success = arr.filter(r => r.success);
    const fail = arr.length - success.length;
    const scores = success.map(r => r.score || 0);
    const avgScore = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
    const avgReach = success.length ? (success.map(r => r.reachCount || 0).reduce((a, b) => a + b, 0) / success.length).toFixed(1) : 0;
    const avgMatch = success.length ? (success.map(r => r.matchCount || 0).reduce((a, b) => a + b, 0) / success.length).toFixed(1) : 0;
    const avgSafety = success.length ? (success.map(r => r.safetyCount || 0).reduce((a, b) => a + b, 0) / success.length).toFixed(1) : 0;
    return { total: arr.length, success: success.length, fail, avgScore, avgReach, avgMatch, avgSafety };
  };
  
  const uStats = calcStats(results.undergrad);
  const gStats = calcStats(results.grad);
  
  console.log('\\n【本科申请】');
  console.log(`  总计: ${uStats.total}个 | 成功: ${uStats.success}个 | 失败: ${uStats.fail}个`);
  console.log(`  平均分数: ${uStats.avgScore} | 平均冲刺: ${uStats.avgReach}所 | 匹配: ${uStats.avgMatch}所 | 保底: ${uStats.avgSafety}所`);
  
  console.log('\\n【研究生申请】');
  console.log(`  总计: ${gStats.total}个 | 成功: ${gStats.success}个 | 失败: ${gStats.fail}个`);
  console.log(`  平均分数: ${gStats.avgScore} | 平均冲刺: ${gStats.avgReach}所 | 匹配: ${gStats.avgMatch}所 | 保底: ${gStats.avgSafety}所`);
  
  // 打印失败案例
  const failUndergrad = results.undergrad.filter(r => !r.success);
  const failGrad = results.grad.filter(r => !r.success);
  
  if (failUndergrad.length > 0) {
    console.log('\\n⚠️ 本科失败案例:');
    failUndergrad.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  if (failGrad.length > 0) {
    console.log('\\n⚠️ 研究生失败案例:');
    failGrad.forEach(r => console.log(`  - ${r.name}: ${r.error}`));
  }
  
  // 保存详细结果
  const outputFile = join(__dirname, 'test-results-' + Date.now() + '.json');
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\\n✅ 详细结果已保存: ${outputFile}`);
  
  return results;
}

runTests().catch(console.error);