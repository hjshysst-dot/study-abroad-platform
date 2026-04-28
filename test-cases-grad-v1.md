# 研究生选校测试用例
# 生成时间: 2026-04-27
# 测试目标: 验证300项目数据库在各种专业/分数下的表现

## 测试方法
curl -X POST http://localhost:3001/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {...},
    "applicationType": "grad"
  }'

---

## 【CS计算机科学】测试组 (8个)

### CS-01: 顶级背景
```json
{
  "name": "CS顶尖选手",
  "undergradSchool": "清华CS",
  "undergradSchoolRank": 1,
  "gpa": "3.9",
  "gre": "335",
  "toefl": "115",
  "major": "计算机科学",
  "researchExperience": "3段科研，2篇CCF-A论文，1段Google实习",
  "recommendationStrength": "强推",
  "publications": "2篇顶会一作"
}
```
预期: 冲刺MIT/Stanford/CMU，匹配UIUC/Wisconsin

### CS-02: 中等背景
```json
{
  "name": "CS普通选手",
  "undergradSchool": "北邮CS",
  "undergradSchoolRank": 30,
  "gpa": "3.5",
  "gre": "320",
  "toefl": "100",
  "major": "计算机科学",
  "researchExperience": "1段课程项目",
  "recommendationStrength": "中"
}
```
预期: 匹配NEU/BU/UCI，保底UF/ASU

### CS-03: 低背景CS
```json
{
  "name": "CS低分选手",
  "undergradSchool": "双非CS",
  "gpa": "3.0",
  "gre": "305",
  "toefl": "90",
  "major": "计算机科学",
  "researchExperience": "无",
  "recommendationStrength": "弱"
}
```
预期: 保底为主，NEU-Vancouver/ASU/UTD

### CS-04: CS转AI/ML
```json
{
  "name": "AI方向申请",
  "undergradSchool": "上交CS",
  "gpa": "3.7",
  "gre": "328",
  "toefl": "105",
  "major": "人工智能/机器学习",
  "researchExperience": "2段ML科研，1篇paper",
  "recommendationStrength": "强"
}
```
预期: 冲刺CMU-ML/UW/UIUC，匹配USC/NYU

### CS-05: 软件工程方向
```json
{
  "name": "软件工程申请",
  "undergradSchool": "西电CS",
  "gpa": "3.3",
  "gre": "315",
  "toefl": "95",
  "major": "软件工程",
  "researchExperience": "1段项目",
  "recommendationStrength": "中"
}
```
预期: 匹配UTD/UMN/Syracuse

### CS-06: CS+金融方向
```json
{
  "name": "CS金融双修",
  "undergradSchool": "复旦CS",
  "gpa": "3.6",
  "gre": "325",
  "toefl": "110",
  "major": "计算机金融",
  "researchExperience": "1段CS + 1段量化实习",
  "recommendationStrength": "中强"
}
```
预期: 匹配Columbia/BU/NYU

### CS-07: 海本CS申请
```json
{
  "name": "海本CS",
  "undergradSchool": "UIUC CS",
  "undergradSchoolRank": 10,
  "gpa": "3.8",
  "gre": "330",
  "toefl": "waive",
  "major": "Computer Science",
  "researchExperience": "2段科研，1段实习",
  "recommendationStrength": "强推"
}
```
预期: 冲刺Stanford/MIT/CMU，匹配Berkeley/Wisconsin

### CS-08: 无GRE申请
```json
{
  "name": "无GRE选手",
  "undergradSchool": "浙大CS",
  "gpa": "3.6",
  "gre": "",
  "toefl": "105",
  "major": "计算机科学",
  "researchExperience": "2段科研",
  "recommendationStrength": "强"
}
```
预期: 降分处理后匹配Cornell/USC

---

## 【Data Science数据分析】测试组 (4个)

### DS-01: DS优秀背景
```json
{
  "name": "DS数据新星",
  "undergradSchool": "北大统计",
  "gpa": "3.8",
  "gre": "332",
  "toefl": "110",
  "major": "数据科学",
  "researchExperience": "2段ML项目，Kaggle竞赛前10%",
  "recommendationStrength": "强"
}
```
预期: 冲刺MIT/Harvard/Berkeley，匹配Columbia/Chicago

### DS-02: DS一般背景
```json
{
  "name": "转DS选手",
  "undergradSchool": "数学系",
  "gpa": "3.4",
  "gre": "318",
  "toefl": "100",
  "major": "数据科学",
  "researchExperience": "1段课程项目",
  "recommendationStrength": "中"
}
```
预期: 匹配Georgetown/BU/NYU DS

### DS-03: Business Analytics
```json
{
  "name": "BA申请者",
  "undergradSchool": "央财金工",
  "gpa": "3.5",
  "gre": "322",
  "toefl": "105",
  "major": "商业分析",
  "researchExperience": "1段商分实习",
  "recommendationStrength": "中"
}
```
预期: 匹配MIT BA/UT Austin BA/UCLA BA

### DS-04: Analytics方向
```json
{
  "name": "Analytics申请",
  "undergradSchool": "对外经贸",
  "gpa": "3.3",
  "gre": "315",
  "toefl": "100",
  "major": "Analytics",
  "researchExperience": "SQL和Python项目",
  "recommendationStrength": "中"
}
```
预期: 匹配GW Analytics/UIC DS/NEU Analytics

---

## 【ECE电子计算机工程】测试组 (4个)

### ECE-01: 顶尖ECE
```json
{
  "name": "EE强人",
  "undergradSchool": "上交EE",
  "gpa": "3.8",
  "gre": "330",
  "toefl": "110",
  "major": "电子工程",
  "researchExperience": "2段硬件项目，1篇论文",
  "recommendationStrength": "强"
}
```
预期: 冲刺Stanford/CMU/Berkeley，匹配UIUC/Umich

### ECE-02: 普通ECE
```json
{
  "name": "EE普通申请",
  "undergradSchool": "成电EE",
  "gpa": "3.3",
  "gre": "312",
  "toefl": "95",
  "major": "电子计算机工程",
  "researchExperience": "1段课程设计",
  "recommendationStrength": "中"
}
```
预期: 匹配UT Austin ECE/OSU ECE/Purdue ECE

### ECE-03: VLSI方向
```json
{
  "name": "芯片设计师",
  "undergradSchool": "复旦微电子",
  "gpa": "3.6",
  "gre": "325",
  "toefl": "105",
  "major": "VLSI/芯片设计",
  "researchExperience": "2段芯片项目",
  "recommendationStrength": "强"
}
```
预期: 冲刺MIT/Stanford，匹配UIUC/Berkeley/Umich

### ECE-04: 机器人方向
```json
{
  "name": "机器人申请",
  "undergradSchool": "哈工大ME",
  "gpa": "3.5",
  "gre": "320",
  "toefl": "100",
  "major": "机器人工程",
  "researchExperience": "2段机器人竞赛/项目",
  "recommendationStrength": "中强"
}
```
预期: 匹配CMU ECE/Gatech ECE/Northwestern ECE

---

## 【MBA】测试组 (3个)

### MBA-01: MBA强人
```json
{
  "name": "MBA申请者",
  "undergradSchool": "北大光华",
  "gpa": "3.6",
  "gmat": "720",
  "toefl": "110",
  "major": "MBA",
  "workExperience": "5年互联网产品经理",
  "recommendationStrength": "强推",
  "extracurriculars": "公益组织创始人"
}
```
预期: 冲刺HBS/Stanford GSB，匹配Wharton/Kellogg

### MBA-02: MBA普通背景
```json
{
  "name": "MBA普通申请",
  "undergradSchool": "中游985",
  "gpa": "3.3",
  "gmat": "680",
  "toefl": "100",
  "major": "MBA",
  "workExperience": "4年银行工作经验",
  "recommendationStrength": "中"
}
```
预期: 匹配UT Austin MBA/NYU Stern/Anderson

### MBA-03: MBA低分
```json
{
  "name": "MBA挑战者",
  "undergradSchool": "普通211",
  "gpa": "3.0",
  "gmat": "640",
  "toefl": "95",
  "major": "MBA",
  "workExperience": "3年销售经验",
  "recommendationStrength": "中"
}
```
预期: 保底UF MBA/UT Dallas MBA/UGA MBA

---

## 【Finance金融】测试组 (3个)

### FIN-01: 金融硕士顶尖
```json
{
  "name": "金工新星",
  "undergradSchool": "复旦数学",
  "gpa": "3.8",
  "gre": "335",
  "toefl": "115",
  "major": "金融工程",
  "researchExperience": "2段量化实习，数学竞赛奖",
  "recommendationStrength": "强"
}
```
预期: 冲刺Princeton/Columbia/Berkeley MSF

### FIN-02: 普通金融
```json
{
  "name": "金融申请者",
  "undergradSchool": "央财金融",
  "gpa": "3.4",
  "gre": "318",
  "toefl": "100",
  "major": "金融",
  "researchExperience": "1段银行实习",
  "recommendationStrength": "中"
}
```
预期: 匹配BC MSF/MD MSF/Fordham MSF

### FIN-03: 无GRE金融
```json
{
  "name": "金融无G",
  "undergradSchool": "上财金融",
  "gpa": "3.5",
  "gre": "",
  "toefl": "105",
  "major": "金融硕士",
  "researchExperience": "2段金融实习",
  "recommendationStrength": "中强"
}
```
预期: 降分后匹配NYU/BU/Fordham

---

## 【Cybersecurity网络安全】测试组 (3个)

### CYBER-01: 安全强人
```json
{
  "name": "安全研究员",
  "undergradSchool": "上交CS",
  "gpa": "3.7",
  "gre": "325",
  "toefl": "108",
  "major": "网络安全",
  "researchExperience": "2段安全研究，CTF竞赛奖项",
  "recommendationStrength": "强"
}
```
预期: 冲刺CMU CyLab/MIT/Berkeley，匹配Georgia Tech/Umich

### CYBER-02: 普通安全
```json
{
  "name": "安全申请者",
  "undergradSchool": "北邮CS",
  "gpa": "3.2",
  "gre": "310",
  "toefl": "95",
  "major": "信息安全",
  "researchExperience": "1段课程实验",
  "recommendationStrength": "中"
}
```
预期: 匹配NEU Cyber/UTD Cyber/GWU Cyber

### CYBER-03: 密码学方向
```json
{
  "name": "密码学申请",
  "undergradSchool": "中科大CS",
  "gpa": "3.6",
  "gre": "328",
  "toefl": "105",
  "major": "密码学",
  "researchExperience": "1段密码学研究",
  "recommendationStrength": "强"
}
```
预期: 冲刺Stanford/MIT/UIUC，匹配Cornell/UW

---

## 【Mechanical机械工程】测试组 (3个)

### ME-01: 机械顶尖
```json
{
  "name": "机械工程师",
  "undergradSchool": "清华机械",
  "gpa": "3.7",
  "gre": "322",
  "toefl": "108",
  "major": "机械工程",
  "researchExperience": "2段机器人项目，1篇论文",
  "recommendationStrength": "强"
}
```
预期: 冲刺MIT/Stanford/Berkeley，匹配Umich/Gatech

### ME-02: 汽车方向
```json
{
  "name": "汽车工程师",
  "undergradSchool": "同济车辆",
  "gpa": "3.4",
  "gre": "315",
  "toefl": "100",
  "major": "车辆工程",
  "researchExperience": "1段车企实习，1个赛车项目",
  "recommendationStrength": "中"
}
```
预期: 匹配Umich ME/UT Austin ME/Northwestern ME

### ME-03: 制造方向
```json
{
  "name": "制造申请",
  "undergradSchool": "华科机械",
  "gpa": "3.2",
  "gre": "308",
  "toefl": "95",
  "major": "先进制造",
  "researchExperience": "1段工艺改进项目",
  "recommendationStrength": "中"
}
```
预期: 匹配Gatech ME/Purdue ME/OSU ME

---

## 【Biomedical生物医学工程】测试组 (2个)

### BME-01: BME顶尖
```json
{
  "name": "BME研究者",
  "undergradSchool": "浙大生医",
  "gpa": "3.7",
  "gre": "325",
  "toefl": "105",
  "major": "生物医学工程",
  "researchExperience": "2段实验室经历，1篇论文",
  "recommendationStrength": "强"
}
```
预期: 冲刺JHU/Stanford/MIT，匹配Duke/Umich/Northwestern

### BME-02: 转BME
```json
{
  "name": "转BME申请",
  "undergradSchool": "材料科学",
  "gpa": "3.3",
  "gre": "312",
  "toefl": "98",
  "major": "生物医学工程",
  "researchExperience": "1段材料实验",
  "recommendationStrength": "中"
}
```
预期: 匹配Gatech BME/WashU BME/Umich BME

---

## 【Marketing市场营销】测试组 (2个)

### MKT-01: Marketing强人
```json
{
  "name": "Marketing新星",
  "undergradSchool": "复旦新闻",
  "gpa": "3.6",
  "gre": "322",
  "toefl": "108",
  "major": "市场营销",
  "researchExperience": "2段品牌实习，社团创始人",
  "recommendationStrength": "强"
}
```
预期: 冲刺Kellogg/Northwestern，匹配Columbia/UCLA

### MKT-02: 普通Marketing
```json
{
  "name": "Marketing申请",
  "undergradSchool": "商科院校",
  "gpa": "3.2",
  "gre": "308",
  "toefl": "98",
  "major": "市场营销",
  "researchExperience": "1段快消实习",
  "recommendationStrength": "中"
}
```
预期: 匹配BU Marketing/Emory/Miami

---

## 【OR-IE运筹学】测试组 (2个)

### ORI-01: OR强人
```json
{
  "name": "OR研究者",
  "undergradSchool": "北大数学",
  "gpa": "3.8",
  "gre": "332",
  "toefl": "110",
  "major": "运筹学",
  "researchExperience": "2段优化研究，竞赛奖项",
  "recommendationStrength": "强"
}
```
预期: 冲刺MIT/Stanford/Cornell，匹配Columbia/Umich

### ORI-02: 供应链方向
```json
{
  "name": "供应链申请",
  "undergradSchool": "物流管理",
  "gpa": "3.4",
  "gre": "315",
  "toefl": "100",
  "major": "供应链管理",
  "researchExperience": "1段物流实习",
  "recommendationStrength": "中"
}
```
预期: 匹配Gatech ISYE/Umich IOE/Michigan

---

## 【PhD博士】测试组 (3个)

### PHD-01: CS PhD顶尖
```json
{
  "name": "CS PhD申请",
  "undergradSchool": "清华CS",
  "gpa": "3.9",
  "gre": "335",
  "toefl": "115",
  "major": "CS PhD",
  "researchExperience": "4段科研，3篇顶会论文，强推",
  "recommendationStrength": "强推",
  "publications": "3篇CCF-A"
}
```
预期: 冲刺Stanford/MIT/Berkeley PhD，匹配Cornell/Harvard

### PHD-02: 统计PhD
```json
{
  "name": "Stats PhD申请",
  "undergradSchool": "北大数学",
  "gpa": "3.8",
  "gre": "330",
  "toefl": "110",
  "major": "Statistics PhD",
  "researchExperience": "3段科研，2篇paper",
  "recommendationStrength": "强推"
}
```
预期: 冲刺Harvard/Stanford/Berkeley，匹配Chicago/Umich

### PHD-03: Econ PhD
```json
{
  "name": "Econ PhD申请",
  "undergradSchool": "复旦经济",
  "gpa": "3.7",
  "gre": "332",
  "toefl": "112",
  "major": "Economics PhD",
  "researchExperience": "2段助研，数学建模奖",
  "recommendationStrength": "强"
}
```
预期: 冲刺MIT/Harvard/Princeton，匹配Chicago/Cornell

---

## 【边缘情况测试】(4个)

### EDGE-01: 极低分
```json
{
  "name": "低分挑战",
  "undergradSchool": "双非",
  "gpa": "2.8",
  "gre": "295",
  "toefl": "80",
  "major": "计算机科学",
  "researchExperience": "无",
  "recommendationStrength": "弱"
}
```
预期: 全部Safety，ASU/U Arizona/NEU-Vancouver

### EDGE-02: 满分配置
```json
{
  "name": "完美选手",
  "undergradSchool": "MIT",
  "undergradSchoolRank": 1,
  "gpa": "4.0",
  "gre": "340",
  "toefl": "120",
  "major": "计算机科学",
  "researchExperience": "5段科研，5篇顶会，强推",
  "recommendationStrength": "最强推",
  "publications": "5篇顶会一作"
}
```
预期: 全部Reach或Match，无Safety

### EDGE-03: 缺少GRE
```json
{
  "name": "无GRE申请",
  "undergradSchool": "中游985",
  "gpa": "3.5",
  "gre": "",
  "toefl": "100",
  "major": "数据科学",
  "researchExperience": "2段项目",
  "recommendationStrength": "中"
}
```
预期: 系统能处理，输出合理学校

### EDGE-04: 冷门专业
```json
{
  "name": "冷门专业",
  "undergradSchool": "普通院校",
  "gpa": "3.3",
  "gre": "310",
  "toefl": "95",
  "major": "地质学",
  "researchExperience": "1段实习",
  "recommendationStrength": "中"
}
```
预期: 系统fallback到CS-Master并给出建议

---

## 批量测试脚本

```bash
# 保存为 test-grad.sh 并运行

echo "=== 研究生选校系统测试 ==="
echo ""

# 测试1: CS顶尖
echo "测试1: CS顶尖背景"
curl -s -X POST http://localhost:3001/api/generate-report \
  -H "Content-Type: application/json" \
  -d '{
    "profile": {
      "name": "CS顶尖选手",
      "undergradSchool": "清华CS",
      "undergradSchoolRank": 1,
      "gpa": "3.9",
      "gre": "335",
      "toefl": "115",
      "major": "计算机科学",
      "researchExperience": "3段科研，2篇CCF-A论文，1段Google实习",
      "recommendationStrength": "强推"
    },
    "applicationType": "grad"
  }' | python3 -c "import json,sys; d=json.load(sys.stdin); print(f\"分数:{d.get('scoreBreakdown',{}).get('totalScore','?')} 学校:{len(d.get('report',{}).get('reach',[]))+len(d.get('report',{}).get('match',[]))+len(d.get('report',{}).get('safety',[]))}所\")" 2>/dev/null || echo "失败"

echo ""
echo "=== 完整测试列表 ==="
cat $0 | grep "### " | head -35
```

---

## 预期问题排查清单

1. **专业检测**: detectGradProgramType是否能识别Data Science/Cybersecurity/OR-IE等新类型？
2. **空值处理**: 无GRE/无publication/无research时是否报错？
3. **选校数量**: 每个分类返回多少学校？是否合理？
4. **概率分布**: reach学校的概率是否在合理范围(5-30%)？
5. **Fallback机制**: 冷门专业是否正确fallback到CS-Master？
6. **数据库匹配**: 新增的Cybersecurity/Marketing/OR-IE等是否能被正确识别？
7. **分数计算**: 不同背景的分数是否符合预期区间(40-100)？