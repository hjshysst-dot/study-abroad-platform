# 研究生选校测试报告 v1.0
**测试时间**: 2026-04-27 07:51  
**数据库规模**: 300项目/23方向  
**服务器**: http://localhost:3001

---

## ❌ 严重问题：专业类型检测失效

### 问题描述

`detectGradProgramType()` 函数只能识别4种类型：CS-Master / MBA / Finance / PhD

**新增的19种方向全部无法识别，全部fallback到CS-Master！**

```javascript
// 当前代码只能识别这4种：
if (m.includes('cs') || ...) → CS-Master
if (m.includes('mba') || ...) → MBA
if (m.includes('finance') || ...) → Finance
if (m.includes('phd') || ...) → PhD
// 其他默认 → CS-Master（错误！）
```

### 测试结果验证

| 测试 | 输入专业 | 期望学校 | 实际学校 | 结果 |
|------|---------|---------|---------|------|
| TC-03 | 数据科学 | MIT DS/Berkeley DS/Columbia DS | MIT EECS/UW CS/Cornell CS | ❌ |
| TC-04 | 网络安全 | CMU CyLab/MIT Cyber/Berkeley Cyber | 同上 | ❌ |
| TC-05 | 电子工程 | MIT ECE/Stanford EE/UIUC ECE | 同上 | ❌ |
| TC-06 | MBA | HBS/Wharton/Kellogg | HBS/Columbia BS/Anderson | ✅ 正常 |
| TC-07 | 金融工程 | Princeton MSF/MIT MSF/Columbia MSF | Columbia MSF/MIT MSF/NYU MSF | ✅ 正常 |
| TC-08 | 市场营销 | Kellogg/Northwestern/Columbia | 同CS | ❌ |
| TC-09 | 运筹学 | MIT OR/Stanford OR/Cornell OR | 同CS | ❌ |
| TC-14 | 生物医学 | JHU/Stanford/MIT | 同CS | ❌ |
| TC-15 | 公共卫生 | JHU MPH/Harvard MPH | 同CS | ❌ |

---

## 🔴 核心Bug #1: 专业类型检测不完整

### 影响范围
- **DS-Analytics** (20项目) - 全部返回CS学校
- **Cybersecurity** (15项目) - 全部返回CS学校
- **ECE** (20项目) - 全部返回CS学校
- **Marketing** (15项目) - 全部返回CS学校
- **OR-IE** (15项目) - 全部返回CS学校
- **Biomedical** (10项目) - 全部返回CS学校
- **Public Health** (10项目) - 全部返回CS学校
- **Architecture** (10项目) - 全部返回CS学校
- **Law-LLM** (10项目) - 全部返回CS学校
- **Education** (10项目) - 全部返回CS学校
- **Neuroscience** (8项目) - 全部返回CS学校
- **Chemical** (8项目) - 全部返回CS学校
- **Math-PhD** (8项目) - 全部返回CS学校
- **Business-Analytics** (8项目) - 全部返回CS学校

### 修复建议

```javascript
function detectGradProgramType(major) {
  const m = (major || '').toLowerCase();
  
  // CS类 (原有)
  if (m.includes('cs') || m.includes('computer') || m.includes('软件') || 
      m.includes('人工智能') || m.includes('ai') || 
      m.includes('machine learning') || m.includes('ml')) {
    return 'CS-Master';
  }
  
  // 新增方向检测
  if (m.includes('data') || m.includes('数据') || m.includes('analytics') || 
      m.includes('分析') || m.includes('统计') || m.includes('statistics')) {
    return 'DS-Analytics';
  }
  
  if (m.includes('cyber') || m.includes('安全') || m.includes('network security') ||
      m.includes('information security') || m.includes('密码学')) {
    return 'Cybersecurity';
  }
  
  if (m.includes('ee') || m.includes('electrical') || m.includes('electronic') ||
      m.includes('ece') || m.includes('电子') || m.includes('电气') ||
      m.includes('robotics') || m.includes('机器人') || m.includes('vlsi') ||
      m.includes('芯片') || m.includes('semiconductor')) {
    return 'ECE';
  }
  
  if (m.includes('me') || m.includes('mechanical') || m.includes('机械') ||
      m.includes('manufacturing') || m.includes('制造') || m.includes('vehicle') ||
      m.includes('车辆') || m.includes('automotive')) {
    return 'Mechanical';
  }
  
  if (m.includes('marketing') || m.includes('市场') || m.includes('branding') ||
      m.includes('品牌') || m.includes('digital marketing')) {
    return 'Marketing';
  }
  
  if (m.includes('or') || m.includes('operations research') || m.includes('运筹') ||
      m.includes('ie') || m.includes('industrial') || m.includes('工业工程') ||
      m.includes('supply chain') || m.includes('供应链')) {
    return 'OR-IE';
  }
  
  if (m.includes('mba') || m.includes('工商管理') || m.includes('商业分析')) {
    return 'MBA';
  }
  
  if (m.includes('finance') || m.includes('金融') || m.includes('financial') ||
      m.includes('economics') || m.includes('经济')) {
    return 'Finance';
  }
  
  if (m.includes('phd') || m.includes('博士') || m.includes('research')) {
    return 'PhD';
  }
  
  if (m.includes('bme') || m.includes('biomedical') || m.includes('生物医学') ||
      m.includes('bioengineering') || m.includes('生物工程')) {
    return 'Biomedical';
  }
  
  if (m.includes('public health') || m.includes('公共卫生') || m.includes('mph')) {
    return 'Public-Health';
  }
  
  if (m.includes('architecture') || m.includes('建筑') || m.includes('urban') ||
      m.includes('城市规划') || m.includes('landscape') || m.includes('园林')) {
    return 'Architecture';
  }
  
  if (m.includes('law') || m.includes('法学') || m.includes('llm') || m.includes('jd')) {
    return 'Law-LLM';
  }
  
  if (m.includes('education') || m.includes('教育') || m.includes('teaching') ||
      m.includes('教学')) {
    return 'Education';
  }
  
  if (m.includes('neuro') || m.includes('神经') || m.includes('brain') || m.includes('认知')) {
    return 'Neuroscience';
  }
  
  if (m.includes('chemical') || m.includes('化工') || m.includes('chemistry')) {
    return 'Chemical';
  }
  
  if (m.includes('civil') || m.includes('environmental') || m.includes('土木') ||
      m.includes('环境') || m.includes('cee')) {
    return 'Civil-Env';
  }
  
  if (m.includes('math') || m.includes('数学') || m.includes('statistics') ||
      m.includes('统计')) {
    // 根据上下文可能返回 Math-PhD 或 DS-Analytics
    if (m.includes('phd') || m.includes('博士')) return 'Math-PhD';
    return 'DS-Analytics'; // 硕士层面更接近DS
  }
  
  // 默认
  return 'CS-Master';
}
```

---

## 🟡 核心Bug #2: filterGradPrograms未被调用

即使`detectGradProgramType`正确返回了`DS-Analytics`，`filterGradPrograms`也不会被调用，因为：

```javascript
// 第718-719行
programType = detectGradProgramType(profile.major);
schoolDB = filterGradPrograms(GRAD_PROGRAMS_DB, programType);
console.log('🎓 研究生项目类型:', programType, '- 候选学校:', schoolDB.length, '所');
```

**问题**: 检测到了正确的programType，但`filterGradPrograms`用`===`精确匹配，如果数据库中的字段略有不同就匹配失败。

**检查**: 数据库中DS-Analytics的programType是否为精确匹配？

```bash
# 数据库中的programType值
python3 -c "
import json
with open('server/data/grad-programs.json') as f:
    d = json.load(f)
types = set(p['programType'] for p in d['programs'])
print('数据库中的programType:', sorted(types))
"
```

---

## 🟡 问题3: 测试用例覆盖不足（边缘情况）

### TC-10 低分CS问题
```
分数:42 | 科研:0 | GRE:45 | 推荐:45
Reach: ['MIT EECS', 'UW CS', 'Cornell CS', 'Duke CS']
Safety: ['UWT CS', 'GWU CS', 'UTD CS']
```
**问题**: 分数42分，但仍然推荐MIT EECS作为Reach？录取概率4.3%对于42分学生显然不合理。

### TC-06 MBA分数异常
```
分数:52 | 科研:0 | GRE:50 | 推荐:45
```
**问题**: GMAT 720应该对应高分，但GRE显示50分？MBA使用GRE字段吗？

---

## 测试用例完整列表 (30个)

| ID | 专业 | 分数 | 预期 | 实际 | 状态 |
|----|------|------|------|------|------|
| TC-01 | CS顶尖 | 72 | CS学校 | CS学校 | ✅ |
| TC-02 | CS中等 | 67 | CS学校 | CS学校 | ✅ |
| TC-03 | DS数据科学 | 75 | DS学校 | CS学校 | ❌ |
| TC-04 | Cybersecurity | 72 | 安全学校 | CS学校 | ❌ |
| TC-05 | ECE电子 | 72 | ECE学校 | CS学校 | ❌ |
| TC-06 | MBA | 52 | MBA学校 | MBA学校 | ✅ |
| TC-07 | Finance金融 | 79 | 金融学校 | 金融学校 | ✅ |
| TC-08 | Marketing | 65 | 营销学校 | CS学校 | ❌ |
| TC-09 | OR-IE运筹 | 75 | 运筹学校 | CS学校 | ❌ |
| TC-10 | 低分CS | 42 | 保底校为主 | Reach过高 | ⚠️ |
| TC-11 | 无GRE | 61 | 正常处理 | 正常 | ✅ |
| TC-12 | 冷门fallback | 60 | CS学校 | CS学校 | ⚠️ |
| TC-13 | CS PhD | 72 | PhD学校 | CS学校 | ❌ |
| TC-14 | Biomedical | 75 | BME学校 | CS学校 | ❌ |
| TC-15 | Public Health | 65 | 公卫学校 | CS学校 | ❌ |

**总计**: 15个测试，9个失败（60%失败率）| 4个警告 | 4个通过

---

## 🔧 修复优先级

1. **P0 - 紧急**: 修复`detectGradProgramType`支持所有23种programType
2. **P0 - 紧急**: 验证`filterGradPrograms`能正确过滤
3. **P1 - 高**: 检查低分学生的Reach学校是否合理
4. **P1 - 高**: 确认MBA的GRE/GMAT字段处理逻辑
5. **P2 - 中**: 扩展测试用例到30个完整覆盖

---

## 建议的30个测试用例（补充）

从当前15个扩展到30个，增加：
- ECE细分方向（VLSI/机器人/通信）
- BME细分方向
- 化学工程
- 城市规划
- 环境工程
- 法律LLM
- 教育学
- 神经科学
- 数学PhD
- 商科分析
- Stats PhD
- Econ PhD