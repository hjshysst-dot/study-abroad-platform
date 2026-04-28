#!/bin/bash
# 30学生测试脚本 V2 - 使用正确的API字段格式

OUTPUT_FILE="test-report-v2-$(date +%Y%m%d_%H%M%S).txt"
API_URL="http://localhost:3001/api/generate-report"

> "$OUTPUT_FILE"

# 30个学生，使用正确的API字段格式
declare -a STUDENTS=(
  # 1. 顶尖学霸 - 陈明昊
  '{"profile":{"name":"陈明昊","school":"北京人大附中","gpa":"4.0","sat":"1580","toefl":"118","apCount":"5","honorsCourses":"3","leadership":"信息学竞赛校队队长，多次组织校级竞赛活动","communityService":"120","awards":"USACO Platinum,IMO金牌,全国物理竞赛一等奖,丘成桐科学奖","extracurriculars":"信息学竞赛校队队长，社区服务100+小时，数学夏校(Ross)，校乐团首席","major":"计算机科学","targetCountries":["美国","加拿大"],"budget":"100"}}'
  # 2. 生物科研型 - 李雅琪
  '{"profile":{"name":"李雅琪","school":"上海中学国际部","gpa":"4.0","sat":"1550","act":"35","toefl":"120","apCount":"4","honorsCourses":"2","leadership":"生物实验室研究项目负责人","communityService":"80","awards":"英特尔ISEF三等奖,全国生物奥赛银牌,CTB全国赛一等奖","extracurriculars":"生物实验室研究助理，野外生态调查志愿者，校环保社创始人，校刊主编","major":"生物","targetCountries":["美国","英国"],"budget":"120"}}'
  # 3. 商科精英 - 王浩宇
  '{"profile":{"name":"王浩宇","school":"南京外国语学校","gpa":"3.98","sat":"1560","toefl":"115","apCount":"4","honorsCourses":"3","leadership":"学生会主席","communityService":"100","awards":"NEC金奖,FBLA商业竞赛全国第三,商赛最佳演讲奖","extracurriculars":"学生会主席，模拟联合国社长，Wharton夏校，商业孵化项目创始人","major":"经济学/商科","targetCountries":["美国","英国","香港"],"budget":"100"}}'
  # 4. 物理竞赛 - 张雨桐
  '{"profile":{"name":"张雨桐","school":"深圳中学","gpa":"4.0","sat":"1570","toefl":"119","apCount":"5","honorsCourses":"3","leadership":"物理竞赛培训志愿者组织者","communityService":"60","awards":"物理奥赛省队一等奖,青少年科技创新大赛一等奖,丘成桐物理奖","extracurriculars":"机器人竞赛队主力，物理竞赛培训志愿者，校报科学专栏作者","major":"物理","targetCountries":["美国","加拿大"],"budget":"80"}}'
  # 5. 文科才女 - 刘子轩
  '{"profile":{"name":"刘子轩","school":"复旦附中","gpa":"3.96","sat":"1530","act":"35","toefl":"112","apCount":"3","honorsCourses":"4","leadership":"辩论社社长，模拟联合国秘书长","communityService":"90","awards":"John Locke论文竞赛入围,NYT写作赛获奖,校内辩论赛冠军","extracurriculars":"辩论社社长，校文学社主编，社区阅读推广，英国交换生","major":"历史/国际关系","targetCountries":["美国","英国"],"budget":"100"}}'
  # 6. 综合型 - Emma Zhang
  '{"profile":{"name":"Emma Zhang","school":"上海包玉刚实验学校","gpa":"3.9","sat":"1510","act":"34","toefl":"110","apCount":"3","honorsCourses":"2","leadership":"学生会副会长","communityService":"100","awards":"AMC前5%,CTB全国赛,校级学术奖","extracurriculars":"学生会副会长，志愿者社团负责人，校足球队，音乐节策划","major":"社会学/传媒","targetCountries":["美国","英国","澳大利亚"],"budget":"100"}}'
  # 7. CS工程 - 周天宇
  '{"profile":{"name":"周天宇","school":"杭州学军中学","gpa":"3.85","sat":"1490","toefl":"108","apCount":"3","honorsCourses":"2","leadership":"编程社副社长","communityService":"50","awards":"信息学联赛省二等奖,校三好学生,数学竞赛二等奖","extracurriculars":"编程社副社长，义工服务，校篮球队，科学节组织者","major":"计算机科学","targetCountries":["美国","加拿大","新加坡"],"budget":"80"}}'
  # 8. 医学预科 - Jennifer Wu
  '{"profile":{"name":"Jennifer Wu","school":"广州华南师范大学附中","gpa":"3.88","sat":"1500","toefl":"115","apCount":"3","honorsCourses":"2","leadership":"医学预科社创始人","communityService":"100","awards":"生物奥赛省一等奖,AMCdistinction,校科研创新奖","extracurriculars":"生物研究项目(基因编辑)，医学预科社创始人，校舞蹈队，科学营助教","major":"医学预科/生物","targetCountries":["美国","英国","加拿大"],"budget":"120"}}'
  # 9. 国际关系 - 陈浩然
  '{"profile":{"name":"陈浩然","school":"武汉外国语学校","gpa":"3.8","sat":"1480","act":"33","toefl":"107","apCount":"3","honorsCourses":"2","leadership":"模拟联合国秘书长","communityService":"80","awards":"NEC经济学挑战赛银奖,校辩论赛最佳辩手,模拟联合国代表","extracurriculars":"模拟联合国秘书长，经济学社社长，云南支教，校报编辑","major":"政治学/国际关系","targetCountries":["美国","英国","香港"],"budget":"80"}}'
  # 10. 工程女生 - Lisa Chen
  '{"profile":{"name":"Lisa Chen","school":"成都外国语学校","gpa":"3.92","sat":"1520","toefl":"113","apCount":"4","honorsCourses":"3","leadership":"数学竞赛队队长","communityService":"60","awards":"Physics Bowl前15%,AMC前1%,校数学竞赛冠军","extracurriculars":"数学竞赛队队长，STEM女童权益倡导，校机器人队工程师，社区数学家教","major":"工程","targetCountries":["美国","加拿大"],"budget":"100"}}'
  # 11. 中等偏上 - Michael Liu
  '{"profile":{"name":"Michael Liu","school":"天津实验中学","gpa":"3.7","sat":"1450","toefl":"105","apCount":"2","honorsCourses":"1","leadership":"学生会干事","communityService":"80","awards":"校三好学生,数学竞赛三等奖,英语演讲二等奖","extracurriculars":"学生会干事，篮球队成员，校志愿者社团，环保项目发起人","major":"环境科学","targetCountries":["美国","澳大利亚"],"budget":"70"}}'
  # 12. 艺术设计 - Sophie Wang
  '{"profile":{"name":"Sophie Wang","school":"西安高新一中","gpa":"3.75","sat":"1430","act":"32","toefl":"103","apCount":"3","honorsCourses":"0","leadership":"校舞蹈团团长","communityService":"60","awards":"艺术比赛省二等奖,校优秀学生干部,舞蹈考级十级","extracurriculars":"校舞蹈团团长，美术社创始人，校报美编，博物馆志愿者","major":"艺术/设计","targetCountries":["美国","英国"],"budget":"100"}}'
  # 13. CS一般 - Jason Zhang
  '{"profile":{"name":"Jason Zhang","school":"重庆南开中学","gpa":"3.6","sat":"1400","toefl":"100","apCount":"2","honorsCourses":"1","leadership":"足球队队长","communityService":"40","awards":"信息学联赛省三等奖,校优秀学生,足球冠军","extracurriculars":"信息学竞赛队，校足球队队长，动漫社，社区服务","major":"计算机科学","targetCountries":["美国","澳大利亚"],"budget":"60"}}'
  # 14. 商科女生 - Emily Huang
  '{"profile":{"name":"Emily Huang","school":"苏州外国语学校","gpa":"3.82","sat":"1470","toefl":"108","apCount":"3","honorsCourses":"2","leadership":"经济学社副社长","communityService":"70","awards":"NEC银奖,CTB入选,校优秀干部","extracurriculars":"经济学社副社长，商业挑战赛队员，校合唱团成员，国际交流志愿者","major":"商科","targetCountries":["美国","英国","香港"],"budget":"90"}}'
  # 15. 化学方向 - Ryan Li
  '{"profile":{"name":"Ryan Li","school":"青岛二中国际部","gpa":"3.65","sat":"1380","act":"30","toefl":"98","apCount":"2","honorsCourses":"1","leadership":"科学俱乐部成员","communityService":"60","awards":"校级物理竞赛二等奖,海军夏令营优秀学员,社区义工证书","extracurriculars":"校乐队吉他手，社区图书馆志愿者，游泳队，科学俱乐部","major":"化学/材料科学","targetCountries":["美国","加拿大"],"budget":"70"}}'
  # 16. 国际学校 - Kevin Park
  '{"profile":{"name":"Kevin Park","school":"北京德威英国国际学校","gpa":"3.9","sat":"1490","toefl":"waived","apCount":"3","honorsCourses":"3","leadership":"学生会主席","communityService":"150","awards":"Ivy League Essay Competition Winner,MUN Best Delegate,校学术奖","extracurriculars":"学生会主席，模拟联合国创始团队，LBS商业夏校，社区服务负责人","major":"商科/经济学","targetCountries":["美国","英国","香港","新加坡"],"budget":"120"}}'
  # 17. 艺术管理 - Grace Kim
  '{"profile":{"name":"Grace Kim","school":"上海协和双语学校","gpa":"3.78","sat":"1440","toefl":"110","apCount":"3","honorsCourses":"1","leadership":"学生会副会长，艺术社创始人","communityService":"80","awards":"学生会优秀干部,艺术展最佳作品奖,社区贡献奖","extracurriculars":"学生会副会长，艺术社创始人，慈善音乐会组织者，时装设计爱好者","major":"艺术/时尚管理","targetCountries":["美国","英国","意大利"],"budget":"100"}}'
  # 18. 美高背景 - Alex Wang
  '{"profile":{"name":"Alex Wang","school":"美国Westlake High School","gpa":"3.95","sat":"1520","toefl":"waived","apCount":"4","honorsCourses":"3","leadership":"数学竞赛队队长","communityService":"80","awards":"National Honor Society,AP Scholar with Distinction,校数学队主力","extracurriculars":"数学竞赛队，校游泳队，计算机俱乐部创始人，医院志愿者","major":"计算机科学","targetCountries":["美国"],"budget":"100"}}'
  # 19. 香港金融 - Emily Chen
  '{"profile":{"name":"Emily Chen","school":"香港国际学校","gpa":"3.85","sat":"1460","toefl":"112","apCount":"3","honorsCourses":"2","leadership":"创业俱乐部负责人","communityService":"60","awards":"Hong Kong Academic Competition Honor,校优秀学生","extracurriculars":"学生会干部，创业俱乐部，投行实习，慈善跑组织者","major":"金融/商科","targetCountries":["美国","英国","香港","新加坡"],"budget":"120"}}'
  # 20. 新加坡数学 - Brian Tan
  '{"profile":{"name":"Brian Tan","school":"Singapore International School","gpa":"3.88","sat":"1500","toefl":"115","apCount":"3","honorsCourses":"3","leadership":"数学竞赛队队长","communityService":"60","awards":"Singapore Math Olympiad Silver,National Science Fair,校学术之星","extracurriculars":"数学竞赛队，机器人俱乐部，青年科学家计划，社区服务","major":"数学/计算机","targetCountries":["美国","英国","新加坡","加拿大"],"budget":"80"}}'
  # 21. 寒门学霸 - David Wu
  '{"profile":{"name":"David Wu","school":"湖南省重点中学","gpa":"3.5","sat":"1350","toefl":"95","apCount":"0","honorsCourses":"2","leadership":"信息学竞赛队成员","communityService":"30","awards":"全国信息学联赛二等奖,省级三好学生,数学奥赛省三","extracurriculars":"信息学竞赛队，科技创新大赛，校ACM队，家教兼职","major":"计算机科学","targetCountries":["美国","加拿大"],"budget":"50"}}'
  # 22. 普高逆袭 - Amanda Liu
  '{"profile":{"name":"Amanda Liu","school":"普通高中(非重点)","gpa":"3.7","sat":"1420","toefl":"102","apCount":"2","honorsCourses":"1","leadership":"英语角创始人","communityService":"80","awards":"校英语演讲冠军,作文竞赛一等奖,校三好学生","extracurriculars":"英语角创始人，文学社编辑，社区图书馆志愿者，校园广播站主播","major":"新闻传播/传媒","targetCountries":["美国","澳大利亚","英国"],"budget":"60"}}'
  # 23. 创业型 - Vincent Zhang
  '{"profile":{"name":"Vincent Zhang","school":"武汉英中","gpa":"3.6","sat":"1390","act":"30","toefl":"99","apCount":"3","honorsCourses":"0","leadership":"创业社创始人","communityService":"40","awards":"商赛二等奖,创业大赛入围,校创新奖","extracurriculars":"创业社创始人，家族企业实习，足球社，商业案例分析大赛","major":"工商管理","targetCountries":["美国","英国","澳大利亚"],"budget":"80"}}'
  # 24. 马来西亚国际 - Rachel Ho
  '{"profile":{"name":"Rachel Ho","school":"马来西亚国际学校","gpa":"3.8","sat":"1440","toefl":"110","apCount":"3","honorsCourses":"1","leadership":"生物研究小组组长","communityService":"100","awards":"生物奥赛铜奖,环境项目获奖,校优秀学生","extracurriculars":"环境保护志愿者，生物研究小组，弦乐团，国际义工(巴厘岛)","major":"环境科学/生物","targetCountries":["美国","澳大利亚","英国"],"budget":"70"}}'
  # 25. 韩国音乐 - Daniel Kim
  '{"profile":{"name":"Daniel Kim","school":"韩国国际学校","gpa":"3.72","sat":"1410","toefl":"106","apCount":"2","honorsCourses":"1","leadership":"校乐团指挥","communityService":"60","awards":"韩国国家音乐比赛获奖,校年度人物,作曲比赛入围","extracurriculars":"校乐团指挥，音乐创作，音乐治疗志愿者，多元文化社团","major":"音乐/艺术","targetCountries":["美国","英国","澳大利亚"],"budget":"90"}}'
  # 26. 低分高能创业 - Lucas Yang
  '{"profile":{"name":"Lucas Yang","school":"郑州外国语学校","gpa":"3.4","sat":"1320","toefl":"92","apCount":"0","honorsCourses":"0","leadership":"科技公司实习创始人","communityService":"30","awards":"全国创业大赛金奖,挑战杯科技竞赛一等奖,多项专利","extracurriculars":"科技公司实习，创业公司联合创始人，发明专利3项，创业社群组织者","major":"创业学/计算机","targetCountries":["美国","新加坡"],"budget":"60"}}'
  # 27. 舞蹈特长 - Mia Zhang
  '{"profile":{"name":"Mia Zhang","school":"普通高中","gpa":"3.55","sat":"1300","act":"28","toefl":"90","apCount":"0","honorsCourses":"0","leadership":"舞蹈团团长","communityService":"60","awards":"全国舞蹈大赛金奖,校艺术之星,社会实践活动优秀","extracurriculars":"舞蹈团团长，艺术教育公益，校文艺汇演组织，服装设计自学","major":"艺术管理/舞蹈","targetCountries":["美国","英国","澳大利亚"],"budget":"70"}}'
  # 28. 体育特长 - Chris Lee
  '{"profile":{"name":"Chris Lee","school":"厦门双十中学","gpa":"3.3","sat":"1280","toefl":"88","apCount":"0","honorsCourses":"0","leadership":"校篮球队队长","communityService":"40","awards":"NCAA运动员资格,校篮球MVP,社区服务证书","extracurriculars":"校篮球队队长，运动训练与康复，体育解说志愿者，健身俱乐部","major":"体育管理/运动科学","targetCountries":["美国","澳大利亚"],"budget":"60"}}'
  # 29. 文科写作 - Jessica Wang
  '{"profile":{"name":"Jessica Wang","school":"南京金陵中学","gpa":"3.9","sat":"1500","toefl":"115","apCount":"3","honorsCourses":"4","leadership":"文学社社长，校刊主编","communityService":"70","awards":"纽约时报写作赛获奖,ACTI作文赛特等奖,文学杂志发表","extracurriculars":"文学社社长，校刊主编，创意写作工坊，国际交流生","major":"英语文学/创意写作","targetCountries":["美国","英国","爱尔兰"],"budget":"80"}}'
  # 30. 哲学政治 - Anthony Chen
  '{"profile":{"name":"Anthony Chen","school":"北京四中","gpa":"3.75","sat":"1460","toefl":"110","apCount":"3","honorsCourses":"3","leadership":"哲学社创始人，辩论队队长","communityService":"80","awards":"John Locke论文竞赛入围,模拟联合国最佳代表,哲学论文发表","extracurriculars":"哲学社创始人，辩论队，法律实习(律所)，人文讲座组织","major":"哲学/政治学","targetCountries":["美国","英国"],"budget":"100"}}'
)

echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "🎓 留学选校平台 - 30个学生测试报告 V2 (正确字段格式)" | tee -a "$OUTPUT_FILE"
echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

TOTAL=${#STUDENTS[@]}
SUCCESS=0
FAIL=0

for i in "${!STUDENTS[@]}"; do
  NUM=$((i+1))
  DATA="${STUDENTS[$i]}"
  
  echo "--------------------------------------------------------------------------------" | tee -a "$OUTPUT_FILE"
  echo "📋 学生 $NUM/30" | tee -a "$OUTPUT_FILE"
  echo "--------------------------------------------------------------------------------" | tee -a "$OUTPUT_FILE"
  
  # 提取学生基本信息
  NAME=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['name'])")
  SCHOOL=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['school'])")
  GPA=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['gpa'])")
  SAT=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('sat','N/A'))")
  TOEFL=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('toefl','N/A'))")
  AP=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('apCount','0'))")
  MAJOR=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['major'])")
  
  echo "【基本信息】" | tee -a "$OUTPUT_FILE"
  echo "姓名: $NAME | 高中: $SCHOOL | GPA: $GPA | SAT: $SAT | TOEFL: $TOEFL | AP: ${AP}门" | tee -a "$OUTPUT_FILE"
  echo "专业: $MAJOR" | tee -a "$OUTPUT_FILE"
  
  # 调用API
  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$DATA")
  
  if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
    echo "✅ API调用成功" | tee -a "$OUTPUT_FILE"
    
    TOTAL_SCORE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['totalScore'])")
    ACADEMIC=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['academicScore'])")
    TEST_SCORE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['testScore'])")
    COURSE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['courseRigor'])")
    ACTIVITY=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['activityScore'])")
    HOT_MAJOR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('hotMajorType','普通'))")
    REACH_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['reachCount'])")
    MATCH_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['matchCount'])")
    SAFETY_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['safetyCount'])")
    
    TOP_REACH=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d['data']['reach']; print(f'{r[0][\"shortName\"]}({r[0][\"admissionProbability\"]}%)') if r else print('N/A')")
    TOP_MATCH=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); m=d['data']['match']; print(f'{m[0][\"shortName\"]}({m[0][\"admissionProbability\"]}%)') if m else print('N/A')")
    TOP_SAFETY=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); s=d['data']['safety']; print(f'{s[0][\"shortName\"]}({s[0][\"admissionProbability\"]}%)') if s else print('N/A')")
    STRATEGY=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['strategy']['overall'])")
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "【分数明细】" | tee -a "$OUTPUT_FILE"
    echo "综合:$TOTAL_SCORE | 学术:$ACADEMIC | 考试:$TEST_SCORE | 课程难度:$COURSE | 活动:$ACTIVITY" | tee -a "$OUTPUT_FILE"
    echo "热门专业: $HOT_MAJOR" | tee -a "$OUTPUT_FILE"
    echo "" | tee -a "$OUTPUT_FILE"
    echo "【选校结果】" | tee -a "$OUTPUT_FILE"
    echo "冲刺:$REACH_CNT所 | 匹配:$MATCH_CNT所 | 保底:$SAFETY_CNT所" | tee -a "$OUTPUT_FILE"
    echo "最佳冲刺: $TOP_REACH | 最佳匹配: $TOP_MATCH | 最佳保底: $TOP_SAFETY" | tee -a "$OUTPUT_FILE"
    echo "策略: $STRATEGY" | tee -a "$OUTPUT_FILE"
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 冲刺学校:" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['reach']:
    print(f'  {s[\"shortName\"]} ({s[\"name\"]}) 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]} 学费:\${s[\"tuition\"]}')
" | tee -a "$OUTPUT_FILE"
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 匹配学校:" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['match']:
    print(f'  {s[\"shortName\"]} ({s[\"name\"]}) 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]} 学费:\${s[\"tuition\"]}')
" | tee -a "$OUTPUT_FILE"
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 保底学校:" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['safety']:
    print(f'  {s[\"shortName\"]} ({s[\"name\"]}) 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]} 学费:\${s[\"tuition\"]}')
" | tee -a "$OUTPUT_FILE"
    
    ((SUCCESS++))
  else
    echo "❌ API调用失败" | tee -a "$OUTPUT_FILE"
    ERR=$(echo "$RESPONSE" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("error","未知"))' 2>/dev/null || echo "JSON解析失败")
    echo "错误: $ERR" | tee -a "$OUTPUT_FILE"
    ((FAIL++))
  fi
  
  echo "" | tee -a "$OUTPUT_FILE"
  sleep 0.3
done

echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "📊 最终测试结果" | tee -a "$OUTPUT_FILE"
echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "总计: $TOTAL个学生 | 成功: $SUCCESS | 失败: $FAIL" | tee -a "$OUTPUT_FILE"
echo "报告文件: $OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

# 打印汇总表格
echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "📋 汇总表格" | tee -a "$OUTPUT_FILE"
echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"
printf "| # | 姓名 | GPA | SAT | TOEFL | AP | 综合分 | 学术 | 考试 | 课程 | 活动 | 冲刺 | 匹配 | 保底 | 最佳冲刺 | 最佳匹配 |\n" | tee -a "$OUTPUT_FILE"
printf "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n" | tee -a "$OUTPUT_FILE"

for i in "${!STUDENTS[@]}"; do
  NUM=$((i+1))
  DATA="${STUDENTS[$i]}"
  NAME=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['name'])")
  GPA=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['gpa'])")
  SAT=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('sat','N/A'))")
  TOEFL=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); t=d['profile'].get('toefl','N/A'); print(t if t!='waived' else '免')")
  AP=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('apCount','0'))")
  
  RESPONSE=$(curl -s -X POST "$API_URL" -H "Content-Type: application/json" -d "$DATA")
  
  if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
    TS=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['totalScore'])")
    AC=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['academicScore'])")
    TE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['testScore'])")
    CO=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['courseRigor'])")
    AC2=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['activityScore'])")
    RC=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['reachCount'])")
    MC=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['matchCount'])")
    SC=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['safetyCount'])")
    TR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d['data']['reach']; print(f'{r[0][\"shortName\"]}({r[0][\"admissionProbability\"]}%)') if r else print('N/A')")
    TM=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); m=d['data']['match']; print(f'{m[0][\"shortName\"]}({m[0][\"admissionProbability\"]}%)') if m else print('N/A')")
    printf "| %d | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s | %s |\n" $NUM "$NAME" "$GPA" "$SAT" "$TOEFL" "$AP" "$TS" "$AC" "$TE" "$CO" "$AC2" "$RC" "$MC" "$SC" "$TR" "$TM" | tee -a "$OUTPUT_FILE"
  else
    printf "| %d | %s | ❌ 调用失败 |\n" $NUM "$NAME" | tee -a "$OUTPUT_FILE"
  fi
  sleep 0.3
done

echo "" | tee -a "$OUTPUT_FILE"
echo "✅ 完整报告已保存至: $OUTPUT_FILE"
