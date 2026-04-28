#!/bin/bash
# 30学生测试脚本 - 使用curl循环调用API

OUTPUT_FILE="test-report-$(date +%Y%m%d_%H%M%S).txt"
API_URL="http://localhost:3001/api/generate-report"

# 清空输出文件
> "$OUTPUT_FILE"

# 定义30个学生JSON数据
declare -a STUDENTS=(
  '{"profile":{"name":"陈明昊","school":"北京人大附中","gpa":"4.0/4.0 (W)","sat":"1580","toefl":"118","major":"计算机科学","targetCountries":["美国","加拿大"],"budget":"100"}}'
  '{"profile":{"name":"李雅琪","school":"上海中学国际部","gpa":"4.0/4.0","sat":"1550","act":"35","toefl":"120","major":"生物","targetCountries":["美国","英国"],"budget":"120"}}'
  '{"profile":{"name":"王浩宇","school":"南京外国语学校","gpa":"3.98/4.0","sat":"1560","toefl":"115","major":"经济学/商科","targetCountries":["美国","英国","香港"],"budget":"100"}}'
  '{"profile":{"name":"张雨桐","school":"深圳中学","gpa":"4.0/4.0","sat":"1570","toefl":"119","major":"物理","targetCountries":["美国","加拿大"],"budget":"80"}}'
  '{"profile":{"name":"刘子轩","school":"复旦附中","gpa":"3.96/4.0","sat":"1530","act":"35","toefl":"112","major":"历史/国际关系","targetCountries":["美国","英国"],"budget":"100"}}'
  '{"profile":{"name":"Emma Zhang","school":"上海包玉刚实验学校","gpa":"3.9/4.0","sat":"1510","act":"34","toefl":"110","major":"社会学/传媒","targetCountries":["美国","英国","澳大利亚"],"budget":"100"}}'
  '{"profile":{"name":"周天宇","school":"杭州学军中学","gpa":"3.85/4.0","sat":"1490","toefl":"108","major":"计算机科学","targetCountries":["美国","加拿大","新加坡"],"budget":"80"}}'
  '{"profile":{"name":"Jennifer Wu","school":"广州华南师范大学附中","gpa":"3.88/4.0","sat":"1500","toefl":"115","major":"医学预科/生物","targetCountries":["美国","英国","加拿大"],"budget":"120"}}'
  '{"profile":{"name":"陈浩然","school":"武汉外国语学校","gpa":"3.8/4.0","sat":"1480","act":"33","toefl":"107","major":"政治学/国际关系","targetCountries":["美国","英国","香港"],"budget":"80"}}'
  '{"profile":{"name":"Lisa Chen","school":"成都外国语学校","gpa":"3.92/4.0","sat":"1520","toefl":"113","major":"工程","targetCountries":["美国","加拿大"],"budget":"100"}}'
  '{"profile":{"name":"Michael Liu","school":"天津实验中学","gpa":"3.7/4.0","sat":"1450","toefl":"105","major":"环境科学","targetCountries":["美国","澳大利亚"],"budget":"70"}}'
  '{"profile":{"name":"Sophie Wang","school":"西安高新一中","gpa":"3.75/4.0","sat":"1430","act":"32","toefl":"103","major":"艺术/设计","targetCountries":["美国","英国"],"budget":"100"}}'
  '{"profile":{"name":"Jason Zhang","school":"重庆南开中学","gpa":"3.6/4.0","sat":"1400","toefl":"100","major":"计算机科学","targetCountries":["美国","澳大利亚"],"budget":"60"}}'
  '{"profile":{"name":"Emily Huang","school":"苏州外国语学校","gpa":"3.82/4.0","sat":"1470","toefl":"108","major":"商科","targetCountries":["美国","英国","香港"],"budget":"90"}}'
  '{"profile":{"name":"Ryan Li","school":"青岛二中国际部","gpa":"3.65/4.0","sat":"1380","act":"30","toefl":"98","major":"化学/材料科学","targetCountries":["美国","加拿大"],"budget":"70"}}'
  '{"profile":{"name":"Kevin Park","school":"北京德威英国国际学校","gpa":"3.9/4.0","sat":"1490","toefl":"waived","major":"商科/经济学","targetCountries":["美国","英国","香港","新加坡"],"budget":"120"}}'
  '{"profile":{"name":"Grace Kim","school":"上海协和双语学校","gpa":"3.78/4.0","sat":"1440","toefl":"110","major":"艺术/时尚管理","targetCountries":["美国","英国","意大利"],"budget":"100"}}'
  '{"profile":{"name":"Alex Wang","school":"美国Westlake High School","gpa":"3.95/4.0","sat":"1520","toefl":"waived","major":"计算机科学","targetCountries":["美国"],"budget":"100"}}'
  '{"profile":{"name":"Emily Chen","school":"香港国际学校","gpa":"3.85/4.0","sat":"1460","toefl":"112","major":"金融/商科","targetCountries":["美国","英国","香港","新加坡"],"budget":"120"}}'
  '{"profile":{"name":"Brian Tan","school":"Singapore International School","gpa":"3.88/4.0","sat":"1500","toefl":"115","major":"数学/计算机","targetCountries":["美国","英国","新加坡","加拿大"],"budget":"80"}}'
  '{"profile":{"name":"David Wu","school":"湖南省重点中学","gpa":"3.5/4.0","sat":"1350","toefl":"95","major":"计算机科学","targetCountries":["美国","加拿大"],"budget":"50"}}'
  '{"profile":{"name":"Amanda Liu","school":"普通高中(非重点)","gpa":"3.7/4.0","sat":"1420","toefl":"102","major":"新闻传播/传媒","targetCountries":["美国","澳大利亚","英国"],"budget":"60"}}'
  '{"profile":{"name":"Vincent Zhang","school":"武汉英中","gpa":"3.6/4.0","sat":"1390","act":"30","toefl":"99","major":"工商管理","targetCountries":["美国","英国","澳大利亚"],"budget":"80"}}'
  '{"profile":{"name":"Rachel Ho","school":"马来西亚国际学校","gpa":"3.8/4.0","sat":"1440","toefl":"110","major":"环境科学/生物","targetCountries":["美国","澳大利亚","英国"],"budget":"70"}}'
  '{"profile":{"name":"Daniel Kim","school":"韩国国际学校","gpa":"3.72/4.0","sat":"1410","toefl":"106","major":"音乐/艺术","targetCountries":["美国","英国","澳大利亚"],"budget":"90"}}'
  '{"profile":{"name":"Lucas Yang","school":"郑州外国语学校","gpa":"3.4/4.0","sat":"1320","toefl":"92","major":"创业学/计算机","targetCountries":["美国","新加坡"],"budget":"60"}}'
  '{"profile":{"name":"Mia Zhang","school":"普通高中","gpa":"3.55/4.0","sat":"1300","act":"28","toefl":"90","major":"艺术管理/舞蹈","targetCountries":["美国","英国","澳大利亚"],"budget":"70"}}'
  '{"profile":{"name":"Chris Lee","school":"厦门双十中学","gpa":"3.3/4.0","sat":"1280","toefl":"88","major":"体育管理/运动科学","targetCountries":["美国","澳大利亚"],"budget":"60"}}'
  '{"profile":{"name":"Jessica Wang","school":"南京金陵中学","gpa":"3.9/4.0","sat":"1500","toefl":"115","major":"英语文学/创意写作","targetCountries":["美国","英国","爱尔兰"],"budget":"80"}}'
  '{"profile":{"name":"Anthony Chen","school":"北京四中","gpa":"3.75/4.0","sat":"1460","toefl":"110","major":"哲学/政治学","targetCountries":["美国","英国"],"budget":"100"}}'
)

echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "🎓 留学选校平台 - 30个学生测试报告 - $(date)" | tee -a "$OUTPUT_FILE"
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
  
  # 提取学生姓名
  NAME=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['name'])")
  SCHOOL=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['school'])")
  GPA=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['gpa'])")
  SAT=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('sat','N/A'))")
  TOEFL=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile'].get('toefl','N/A'))")
  MAJOR=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['profile']['major'])")
  COUNTRIES=$(echo "$DATA" | python3 -c "import sys,json; d=json.load(sys.stdin); print(','.join(d['profile']['targetCountries']))")
  
  echo "姓名: $NAME | 高中: $SCHOOL | GPA: $GPA | SAT: $SAT | TOEFL: $TOEFL" | tee -a "$OUTPUT_FILE"
  echo "专业: $MAJOR | 国家: $COUNTRIES" | tee -a "$OUTPUT_FILE"
  
  # 调用API
  RESPONSE=$(curl -s -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$DATA")
  
  # 检查是否成功
  if echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); sys.exit(0 if d.get('success') else 1)" 2>/dev/null; then
    echo "✅ API调用成功" | tee -a "$OUTPUT_FILE"
    
    # 提取关键数据
    TOTAL_SCORE=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['scoreBreakdown']['totalScore'])")
    HOT_MAJOR=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('hotMajorType','普通'))")
    REACH_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['reachCount'])")
    MATCH_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['matchCount'])")
    SAFETY_CNT=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['stats']['safetyCount'])")
    TOP_REACH=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); r=d['data']['reach']; print(f'{r[0][\"shortName\"]}({r[0][\"admissionProbability\"]}%)') if r else print('N/A')")
    TOP_MATCH=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); m=d['data']['match']; print(f'{m[0][\"shortName\"]}({m[0][\"admissionProbability\"]}%)') if m else print('N/A')")
    TOP_SAFETY=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); s=d['data']['safety']; print(f'{s[0][\"shortName\"]}({s[0][\"admissionProbability\"]}%)') if s else print('N/A')")
    STRATEGY=$(echo "$RESPONSE" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['data']['strategy']['overall'])")
    
    echo "📈 综合分数: $TOTAL_SCORE | 热门专业: $HOT_MAJOR" | tee -a "$OUTPUT_FILE"
    echo "🎯 冲刺: $REACH_CNT所 | 匹配: $MATCH_CNT所 | 保底: $SAFETY_CNT所" | tee -a "$OUTPUT_FILE"
    echo "🏆 最佳冲刺: $TOP_REACH | 最佳匹配: $TOP_MATCH | 最佳保底: $TOP_SAFETY" | tee -a "$OUTPUT_FILE"
    echo "💡 策略: $STRATEGY" | tee -a "$OUTPUT_FILE"
    
    # 列出所有学校
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 冲刺学校 (Reach):" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['reach']:
    print(f'   {s[\"shortName\"]} ({s[\"name\"]}) - 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]}')
" | tee -a "$OUTPUT_FILE"
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 匹配学校 (Match):" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['match']:
    print(f'   {s[\"shortName\"]} ({s[\"name\"]}) - 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]}')
" | tee -a "$OUTPUT_FILE"
    
    echo "" | tee -a "$OUTPUT_FILE"
    echo "📋 保底学校 (Safety):" | tee -a "$OUTPUT_FILE"
    echo "$RESPONSE" | python3 -c "
import sys,json
d=json.load(sys.stdin)
for s in d['data']['safety']:
    print(f'   {s[\"shortName\"]} ({s[\"name\"]}) - 录取概率:{s[\"admissionProbability\"]}% Rank:{s[\"rank\"]} {s[\"type\"]}')
" | tee -a "$OUTPUT_FILE"
    
    ((SUCCESS++))
  else
    echo "❌ API调用失败: $(echo $RESPONSE | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("error","未知错误"))' 2>/dev/null || echo "$RESPONSE")" | tee -a "$OUTPUT_FILE"
    ((FAIL++))
  fi
  
  echo "" | tee -a "$OUTPUT_FILE"
  
  # 间隔300ms
  sleep 0.3
done

echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "📊 测试结果汇总" | tee -a "$OUTPUT_FILE"
echo "================================================================================" | tee -a "$OUTPUT_FILE"
echo "总计: $TOTAL个学生 | 成功: $SUCCESS | 失败: $FAIL" | tee -a "$OUTPUT_FILE"
echo "报告已保存至: $OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"

# 输出汇总表格
echo "汇总表格:" | tee -a "$OUTPUT_FILE"
echo "" | tee -a "$OUTPUT_FILE"
