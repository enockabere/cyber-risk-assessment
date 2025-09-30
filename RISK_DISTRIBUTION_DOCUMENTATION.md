# Risk Distribution Chart Documentation
## Understanding the "Breakdown by Severity" Component

### 🎯 What is the Risk Distribution Chart?

The Risk Distribution Chart is like a **pie chart that shows you the recipe of your risks**. Imagine you have a pizza divided into slices - each slice represents how much of your total risk falls into different danger levels (Critical, Severe, Moderate, Sustainable). The bigger the slice, the more risks you have in that category.

---

## 📁 Key Files That Create the Risk Distribution

### 1. **Main Risk Distribution Chart**
**File:** `app/components/RiskDistribution/RiskDistributionChart.tsx`
- **What it does:** Creates the colorful pie chart that shows risk breakdown
- **Simple explanation:** Like a baker who takes all your risks and sorts them into different colored slices based on how dangerous they are
- **Key responsibilities:**
  - Counts how many risks fall into each severity level
  - Calculates percentages for each risk category
  - Creates colored pie slices with the right sizes
  - Shows labels with percentages on each slice

### 2. **Interactive Tooltip**
**File:** `app/components/RiskDistribution/CustomTooltip.tsx`
- **What it does:** Shows detailed information when you hover over a pie slice
- **Simple explanation:** Like a helpful assistant that whispers extra details when you point at something
- **What it shows:**
  - Risk category name (Critical, Severe, etc.)
  - Percentage of total risks
  - Actual number of risk assessments

### 3. **Risk Calculation Rules** (Shared)
**File:** `app/constants/riskStyles.ts`
- **What it does:** Contains the color scheme and rules for categorizing risks
- **Simple explanation:** Like a color palette that tells the chart which color to use for each risk level
- **Color assignments:**
  - 🔴 Critical: Red (#FF1744)
  - 🟠 Severe: Orange (#FF6B35)  
  - 🟡 Moderate: Yellow (#FFB020)
  - 🟢 Sustainable: Green (#00D2AA)

---

## 🔄 How the Risk Distribution Works (Step by Step)

### Step 1: Data Collection
1. The chart receives all your completed risk assessments
2. Each assessment has a probability and impact rating
3. The system looks at every single risk question you've answered

### Step 2: Risk Categorization
1. For each risk assessment, the system:
   - Takes the probability rating (how likely)
   - Takes the impact rating (how bad)
   - Uses the risk matrix to determine the final category
   - Example: High probability + High impact = Critical

### Step 3: Counting and Grouping
1. The system counts how many risks fall into each category:
   - Critical: 5 risks
   - Severe: 12 risks  
   - Moderate: 8 risks
   - Sustainable: 15 risks

### Step 4: Percentage Calculation
1. Calculates what percentage each category represents:
   - Total risks: 40
   - Critical: 5/40 = 12.5%
   - Severe: 12/40 = 30%
   - Moderate: 8/40 = 20%
   - Sustainable: 15/40 = 37.5%

### Step 5: Visual Creation
1. **Pie Chart Creation**: Draws a circular chart divided into colored slices
2. **Slice Sizing**: Makes each slice proportional to its percentage
3. **Color Application**: Colors each slice according to risk level
4. **Label Addition**: Adds percentage labels to each slice

---

## 🎨 Understanding the Visual Elements

### Pie Chart Structure
- **Shape**: Donut-style pie chart (hollow center)
- **Size**: Inner radius 40px, outer radius 80px
- **Spacing**: 2-degree padding between slices for clarity

### Color Coding System
| Risk Level | Color | Hex Code | Meaning |
|------------|-------|----------|---------|
| Critical | 🔴 Red | #FF1744 | Immediate action required |
| Severe | 🟠 Orange | #FF6B35 | High priority attention |
| Moderate | 🟡 Yellow | #FFB020 | Monitor and plan |
| Sustainable | 🟢 Green | #00D2AA | Low concern |

### Interactive Features
- **Hover Effects**: Tooltip appears when you hover over any slice
- **Responsive Design**: Chart adjusts to different screen sizes
- **Clean Labels**: Each slice shows "Risk Level: Percentage%"

---

## 📊 What the Chart Tells You

### 1. **Risk Portfolio Overview**
- **Quick Glance**: See your overall risk health at a glance
- **Balance Check**: Understand if you have too many high-risk items
- **Priority Setting**: Identify which risk levels need most attention

### 2. **Percentage Insights**
- **Risk Distribution**: What portion of your risks are in each category
- **Trend Identification**: Are most risks manageable or concerning?
- **Resource Allocation**: Where to focus your risk management efforts

### 3. **Actionable Information**
- **Red Dominance**: If red slice is large → urgent action needed
- **Green Dominance**: If green slice is large → good risk management
- **Balanced Distribution**: Multiple colors → diverse risk landscape

---

## 🔧 Technical Implementation Details

### Data Processing Flow
```
Raw Risk Data → Risk Calculation → Category Counting → Percentage Calculation → Visual Rendering
```

### Key Functions
1. **calculateRiskRating()**: Determines risk category from probability/impact
2. **riskCounts reducer**: Counts risks in each category
3. **chartData mapping**: Converts counts to percentages and chart format
4. **renderLabel()**: Creates percentage labels for pie slices

### Chart Configuration
- **Chart Type**: Recharts PieChart component
- **Responsive**: Automatically adjusts to container size
- **Interactive**: Hover tooltips for detailed information
- **Accessible**: Clear labels and color contrast

---

## 🎯 Business Value

### For Management
- **Executive Summary**: Quick visual of organizational risk health
- **Resource Planning**: Understand where to invest risk management resources
- **Progress Tracking**: Monitor changes in risk distribution over time

### For Risk Teams
- **Workload Planning**: See which risk categories need most attention
- **Trend Analysis**: Identify if risks are improving or worsening
- **Communication Tool**: Easy way to explain risk status to stakeholders

### For Decision Making
- **Priority Setting**: Focus on categories with highest percentages
- **Budget Allocation**: Invest more in areas with critical/severe risks
- **Strategy Development**: Develop targeted approaches for each risk level

---

## 🚀 How to Read the Chart

### 1. **Size Matters**
- **Large slices** = Many risks in that category
- **Small slices** = Few risks in that category
- **No slice** = No risks in that category

### 2. **Color Significance**
- **More red/orange** = Higher overall risk profile
- **More green** = Better risk management
- **Balanced colors** = Diverse risk landscape

### 3. **Percentage Interpretation**
- **Critical > 20%** = Urgent attention needed
- **Severe > 30%** = Significant risk management required
- **Sustainable > 50%** = Good risk management practices

---

## 💡 Quick Tips for Using the Chart

1. **Regular Monitoring**: Check the distribution regularly to track improvements
2. **Focus on Red**: Always address Critical risks first
3. **Balance Goal**: Aim for larger green slices over time
4. **Use with Matrix**: Combine with Risk Assessment Matrix for complete picture
5. **Share Insights**: Use the visual to communicate risk status to stakeholders

The Risk Distribution Chart transforms complex risk data into an easy-to-understand visual that helps you quickly assess your organization's overall risk health and make informed decisions about where to focus your risk management efforts!