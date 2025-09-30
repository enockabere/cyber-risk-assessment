# Risk Assessment Matrix Documentation
## Understanding How the Risk Assessment Matrix Works at http://localhost:3000/dashboard/responses

### 🎯 What is the Risk Assessment Matrix?

The Risk Assessment Matrix is like a **visual map** that shows how dangerous different risks are to your organization. Think of it like a weather map - instead of showing rain and sunshine, it shows which risks need immediate attention (red zones) and which ones are manageable (green zones).

---

## 📁 Key Files That Make the Magic Happen

### 1. **Main Dashboard Page** 
**File:** `app/dashboard/responses/page.tsx`
- **What it does:** This is the main page you see when you visit the responses dashboard
- **Simple explanation:** Like the control center of a spaceship - it brings together all the different pieces and displays them on your screen
- **Key responsibilities:**
  - Fetches your risk assessment data from the database
  - Shows summary cards with important numbers
  - Displays the colorful risk matrix chart
  - Lists all your individual risk assessments

### 2. **Risk Matrix Chart Component**
**File:** `app/components/RiskMatrix/RiskMatrixChart.tsx`
- **What it does:** Creates the actual visual chart with colored dots
- **Simple explanation:** Like an artist that paints dots on a canvas - each dot represents risks, and the colors show how serious they are
- **How it works:**
  - Takes your risk data and converts it into chart points
  - Places dots on a grid based on probability (how likely) vs impact (how bad)
  - Colors the dots based on risk level (green = safe, red = dangerous)

**Code Example - Data Processing:**
```typescript
const RiskMatrixChart: FC<RiskMatrixChartProps> = memo(({ questions }) => {
  // Initialize empty grid for counting risks
  const riskCounts: Record<string, Record<string, { count: number; rating: string }>> = {};

  // Set up empty counters for each probability/impact combination
  levelLabels.forEach((impact) => {
    riskCounts[impact] = {};
    levelLabels.forEach((probability) => {
      const rating = riskMatrix[probability]?.[impact] || "Sustainable";
      riskCounts[impact][probability] = { count: 0, rating };
    });
  });

  // Count how many risks fall into each grid cell
  questions.forEach((q) => {
    const prob = q.selectedOption.probability?.toUpperCase();
    const impact = q.selectedOption.impact?.toUpperCase();
    if (prob && impact && riskCounts[impact]?.[prob]) {
      riskCounts[impact][prob].count += 1;  // Add one to this cell
    }
  });

  // Convert counts to chart data points
  const chartData: ChartPoint[] = levelLabels.flatMap((impact, yIndex) =>
    levelLabels.map((probability, xIndex) => {
      const cell = riskCounts[impact][probability];
      return {
        x: xIndex + 1,        // X position on chart
        y: yIndex + 1,        // Y position on chart
        count: cell.count,    // Number of risks here
        rating: cell.rating,  // Risk level for coloring
        impactLabel: displayLabels[xIndex],
        probabilityLabel: displayLabels[yIndex],
      };
    })
  );
```
**What this code does:**
1. Creates a 5x5 grid to count risks in each probability/impact combination
2. Goes through all your risk assessments and counts them in the right grid cells
3. Converts the counts into chart points with X/Y positions
4. Each point knows how many risks it represents and what color it should be

### 3. **Risk Calculation Rules**
**File:** `app/constants/riskStyles.ts`
- **What it does:** Contains the "recipe" for determining risk levels
- **Simple explanation:** Like a cookbook that tells the system "if probability is HIGH and impact is HIGH, then the risk is CRITICAL"

**Code Example - The Risk Matrix:**
```typescript
export const riskMatrix: Record<string, Record<string, string>> = {
  VERY_LOW: {
    VERY_LOW: "Sustainable",   // Very Low + Very Low = Green
    LOW: "Sustainable",       // Very Low + Low = Green
    MEDIUM: "Sustainable",    // Very Low + Medium = Green
    HIGH: "Moderate",         // Very Low + High = Yellow
    VERY_HIGH: "Severe",      // Very Low + Very High = Orange
  },
  LOW: {
    VERY_LOW: "Sustainable",  // Low + Very Low = Green
    LOW: "Sustainable",       // Low + Low = Green
    MEDIUM: "Moderate",       // Low + Medium = Yellow
    HIGH: "Severe",           // Low + High = Orange
    VERY_HIGH: "Critical",    // Low + Very High = Red
  },
  MEDIUM: {
    VERY_LOW: "Sustainable",  // Medium + Very Low = Green
    LOW: "Moderate",          // Medium + Low = Yellow
    MEDIUM: "Moderate",       // Medium + Medium = Yellow
    HIGH: "Severe",           // Medium + High = Orange
    VERY_HIGH: "Critical",    // Medium + Very High = Red
  },
  HIGH: {
    VERY_LOW: "Sustainable",  // High + Very Low = Green
    LOW: "Moderate",          // High + Low = Yellow
    MEDIUM: "Severe",         // High + Medium = Orange
    HIGH: "Critical",         // High + High = Red
    VERY_HIGH: "Critical",    // High + Very High = Red
  },
  VERY_HIGH: {
    VERY_LOW: "Moderate",     // Very High + Very Low = Yellow
    LOW: "Severe",            // Very High + Low = Orange
    MEDIUM: "Severe",         // Very High + Medium = Orange
    HIGH: "Critical",         // Very High + High = Red
    VERY_HIGH: "Critical",    // Very High + Very High = Red
  },
};
```
**What this code does:**
1. Creates a lookup table where probability (rows) meets impact (columns)
2. Each combination produces a specific risk level
3. The system uses this matrix to consistently calculate risk ratings
4. More dangerous combinations (high probability + high impact) = Critical (Red)

### 4. **Risk Calculation Functions**
**File:** `app/lib/utils/utils.ts`
- **What it does:** Contains the math functions that calculate risk levels
- **Simple explanation:** Like a calculator that takes two numbers (probability and impact) and tells you the final risk level
- **Key functions:**
  - `calculateRiskRating()` - Determines if a risk is Sustainable, Moderate, Severe, or Critical
  - `getAverageRiskRating()` - Calculates the overall risk level across all assessments
  - `getHighestRisk()` - Finds the most dangerous risk

**Code Example - Main Risk Calculator:**
```typescript
export function calculateRiskRating(prob?: string, impact?: string): string {
  if (!prob || !impact) return "Not Rated";  // If missing data, return "Not Rated"
  const p = prob.toUpperCase();              // Convert to uppercase for consistency
  const i = impact.toUpperCase();            // Convert to uppercase for consistency
  return riskMatrix[p]?.[i] || "Unknown";    // Look up risk level in matrix
}
```
**What this code does:**
1. Takes probability and impact as inputs
2. Checks if both values exist (returns "Not Rated" if missing)
3. Converts both to uppercase to match the matrix format
4. Looks up the combination in the risk matrix to get the final rating

**Code Example - Average Risk Calculator:**
```typescript
export function getAverageRiskRating(questions: Question[]): string | null {
  const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical"];
  const ratingScores = { Sustainable: 0, Moderate: 1, Severe: 2, Critical: 3 };

  // Convert all questions to risk ratings
  const validRatings = questions
    .map((q) => {
      const prob = q.selectedOption.probability?.toUpperCase();
      const impact = q.selectedOption.impact?.toUpperCase();
      return prob && impact ? riskMatrix[prob]?.[impact] : null;
    })
    .filter((r): r is keyof typeof ratingScores => r !== undefined);

  if (validRatings.length === 0) return null;

  // Calculate average score and convert back to rating
  const total = validRatings.reduce((sum, r) => sum + ratingScores[r], 0);
  const avg = Math.round(total / validRatings.length);
  return ratingOrder[avg];
}
```
**What this code does:**
1. Assigns numbers to each risk level (Sustainable=0, Critical=3)
2. Converts all questions to their risk ratings
3. Calculates the average numerical score
4. Converts the average back to a risk level name

### 5. **Data Fetching API**
**File:** `app/api/assessment/responses/route.ts`
- **What it does:** Gets your risk assessment data from the database
- **Simple explanation:** Like a waiter that goes to the kitchen (database) and brings your order (risk data) to your table (the webpage)
- **What it fetches:**
  - Your background information (company details, etc.)
  - All your completed risk assessments
  - The answers you selected for each risk question

**Code Example - Data Fetching:**
```typescript
export async function GET() {
  try {
    // Get user session to know who's asking for data
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in database
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    // Get background responses (company info, etc.)
    const backgroundResponses = await prisma.backgroundResponse.findMany({
      where: { userId: user.id },
      include: { field: true },  // Include field details
    });

    // Get latest submission with all answers
    const latestSubmission = await prisma.submission.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },  // Most recent first
      include: {
        answers: {
          include: {
            question: { include: { asset: true } },  // Question details + asset info
            selectedOption: true,                    // The chosen answer
          },
        },
      },
    });

    // Transform database data into format the chart needs
    const questions = latestSubmission?.answers.map((ans) => ({
      position: ans.question.position,
      text: ans.question.text,
      assetId: ans.question.assetId || undefined,
      assetName: ans.question.asset?.name || undefined,
      selectedOption: {
        text: ans.selectedOption.text,
        probability: ans.selectedOption.probability ?? undefined,
        impact: ans.selectedOption.impact ?? undefined,
        controlDescription: ans.selectedOption.controlDescription ?? undefined,
      },
    })) ?? [];

    return NextResponse.json({
      backgroundResponses,
      questions,
    });
  } catch (error) {
    console.error("Error in assessment responses route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```
**What this code does:**
1. Verifies the user is logged in and authorized
2. Fetches background information from the database
3. Gets the most recent risk assessment submission
4. Includes all related data (questions, answers, assets)
5. Transforms the database format into what the chart component expects
6. Returns the data as JSON for the frontend to use

### 6. **Visual Dot Component**
**File:** `app/components/RiskMatrix/CustomDot.tsx`
- **What it does:** Creates the individual colored circles on the chart
- **Simple explanation:** Like a stamp that creates colored circles - bigger circles mean more risks in that spot, different colors mean different danger levels

**Code Example - Dot Creation:**
```typescript
const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, payload }) => {
  // Calculate dot size based on number of risks (more risks = bigger dot)
  const size = Math.max(8, Math.min(25, 8 + payload.count * 2));
  
  // Get color based on risk level
  const fillColor = riskColors[payload.rating as keyof typeof riskColors];

  return (
    <g>
      {/* Outer glow effect */}
      <circle cx={cx} cy={cy} r={size + 2} fill={fillColor} fillOpacity={0.2} />
      
      {/* Main colored dot */}
      <circle
        cx={cx} cy={cy} r={size}
        fill={fillColor}
        stroke="#ffffff"
        strokeWidth={1.5}
      />
      
      {/* Number label inside dot (if there are risks) */}
      {payload.count > 0 && (
        <text
          x={cx} y={cy + 3}
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="bold"
        >
          {payload.count}
        </text>
      )}
    </g>
  );
};
```
**What this code does:**
1. Calculates dot size: minimum 8px, maximum 25px, grows with risk count
2. Gets the appropriate color from the risk color scheme
3. Draws a glowing outer circle for visual appeal
4. Draws the main colored circle with white border
5. Adds the count number inside the dot (if there are risks in that cell)

### 7. **Question Display Cards**
**File:** `app/components/Questions/QuestionCard.tsx`
- **What it does:** Shows each risk assessment in a neat card format
- **Simple explanation:** Like individual report cards that show each risk question, your answer, and the calculated danger level

### 8. **Database Structure**
**File:** `prisma/schema.prisma`
- **What it does:** Defines how risk data is stored in the database
- **Simple explanation:** Like filing cabinets with specific drawers for different types of information
- **Key storage areas:**
  - **Questions** - The risk scenarios you evaluate
  - **RiskOptions** - The possible answers with probability and impact levels
  - **Answers** - Your selected responses
  - **Submissions** - Complete sets of your assessments

---

## 🔄 How It All Works Together (The Complete Journey)

### Step 1: Data Collection
1. You complete risk assessments by answering questions
2. Each answer includes:
   - **Probability** (How likely is this to happen?)
   - **Impact** (How bad would it be if it happened?)
   - **Control measures** (What can prevent/reduce this risk?)

### Step 2: Data Storage
1. Your answers are saved in the database
2. The system links your answers to specific questions
3. Background information (company details) is also stored

### Step 3: Risk Calculation
1. The system takes your probability and impact ratings
2. Uses the risk matrix rules to determine the final risk level:
   - **Sustainable** (Green) - Low concern
   - **Moderate** (Yellow) - Watch carefully
   - **Severe** (Orange) - Take action soon
   - **Critical** (Red) - Immediate action required

### Step 4: Visual Display
1. **Risk Matrix Chart**: Shows all risks as colored dots on a grid
   - X-axis = Impact (how bad)
   - Y-axis = Probability (how likely)
   - Dot color = Risk level
   - Dot size = Number of risks in that spot

2. **Summary Cards**: Show key statistics
   - Total number of assessments
   - Highest risk level found
   - Number of control measures in place
   - Different risk categories identified

3. **Individual Cards**: List each risk assessment with details

---

## 🎨 Color Coding System

| Color | Risk Level | Meaning | Action Needed |
|-------|------------|---------|---------------|
| 🟢 Green | Sustainable | Low risk, manageable | Keep monitoring |
| 🟡 Yellow | Moderate | Medium risk, attention needed | Plan improvements |
| 🟠 Orange | Severe | High risk, action required | Take action soon |
| 🔴 Red | Critical | Extreme risk, urgent action | Act immediately |

---

## 📊 Understanding the Matrix Grid

The Risk Assessment Matrix is a 5x5 grid where:

**Horizontal Axis (Impact):** How bad would it be?
- Very Low → Low → Medium → High → Very High

**Vertical Axis (Probability):** How likely is it to happen?
- Very Low → Low → Medium → High → Very High

**Example:**
- A risk with "High Probability" and "High Impact" = **Critical** (Red)
- A risk with "Low Probability" and "Low Impact" = **Sustainable** (Green)

---

## 🔧 Technical Components Summary

| Component | Purpose | User Benefit |
|-----------|---------|--------------|
| Main Page | Orchestrates everything | See all your risk information in one place |
| Risk Matrix Chart | Visual risk mapping | Quickly spot dangerous areas |
| Risk Calculator | Determines danger levels | Consistent, objective risk ratings |
| Data API | Fetches information | Always shows your latest assessments |
| Question Cards | Detailed view | Understand each individual risk |
| Database | Stores everything | Your data is safe and organized |

---

## 🎯 Why This System Works

1. **Visual Understanding**: Colors and charts make complex risk data easy to understand
2. **Consistent Scoring**: Mathematical formulas ensure fair, objective risk ratings
3. **Comprehensive View**: See both the big picture (matrix) and details (individual cards)
4. **Real-time Updates**: Always shows your most current risk assessments
5. **Actionable Insights**: Clear color coding tells you what needs attention first

---

## 🔧 How to Customize the Risk Matrix Formula

### **Changing Risk Level Thresholds**
To make the matrix more or less strict, modify the risk matrix in `app/constants/riskStyles.ts`:

**Example - Making it More Conservative (More Critical Risks):**
```typescript
export const riskMatrix: Record<string, Record<string, string>> = {
  VERY_LOW: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",
    MEDIUM: "Moderate",      // Changed from "Sustainable" to "Moderate"
    HIGH: "Severe",          // Changed from "Moderate" to "Severe"
    VERY_HIGH: "Critical",   // Changed from "Severe" to "Critical"
  },
  // ... continue for other levels
};
```

**Example - Making it More Lenient (Fewer Critical Risks):**
```typescript
export const riskMatrix: Record<string, Record<string, string>> = {
  HIGH: {
    VERY_LOW: "Sustainable",
    LOW: "Sustainable",     // Changed from "Moderate" to "Sustainable"
    MEDIUM: "Moderate",     // Changed from "Severe" to "Moderate"
    HIGH: "Severe",         // Changed from "Critical" to "Severe"
    VERY_HIGH: "Critical",  // Remains Critical
  },
  // ... continue for other levels
};
```

### **Adding New Risk Levels**
To add a new risk level (e.g., "Extreme"), update multiple files:

**1. Add to Risk Matrix (`riskStyles.ts`):**
```typescript
export const riskMatrix: Record<string, Record<string, string>> = {
  VERY_HIGH: {
    VERY_HIGH: "Extreme",    // New highest level
    HIGH: "Critical",
    // ... other combinations
  },
};

export const riskColors = {
  Sustainable: "#00D2AA",
  Moderate: "#FFB020",
  Severe: "#FF6B35",
  Critical: "#FF1744",
  Extreme: "#8B0000",       // New dark red color
};
```

**2. Update Calculation Functions (`utils.ts`):**
```typescript
export function getAverageRiskRating(questions: Question[]): string | null {
  const ratingOrder = ["Sustainable", "Moderate", "Severe", "Critical", "Extreme"];
  const ratingScores = { 
    Sustainable: 0, 
    Moderate: 1, 
    Severe: 2, 
    Critical: 3,
    Extreme: 4     // Add new level
  };
  // ... rest of function
}
```

### **Changing Color Schemes**
Modify colors in `app/constants/riskStyles.ts`:

```typescript
export const riskColors = {
  Sustainable: "#4CAF50",   // Different green
  Moderate: "#FF9800",      // Different orange
  Severe: "#F44336",        // Different red
  Critical: "#9C27B0",      // Purple instead of red
};
```

### **Adjusting Chart Sensitivity**
To change how the chart displays risks, modify the dot sizing in `CustomDot.tsx`:

```typescript
const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, payload }) => {
  // Original: size = Math.max(8, Math.min(25, 8 + payload.count * 2));
  const size = Math.max(12, Math.min(30, 12 + payload.count * 3)); // Bigger dots
  // Or for smaller dots:
  // const size = Math.max(6, Math.min(20, 6 + payload.count * 1.5));
```

### **Creating Custom Risk Categories**
To add industry-specific risk categories, create a new matrix:

```typescript
// For Financial Services
export const financialRiskMatrix: Record<string, Record<string, string>> = {
  VERY_LOW: {
    VERY_LOW: "Acceptable",
    LOW: "Acceptable",
    MEDIUM: "Monitor",
    HIGH: "Mitigate",
    VERY_HIGH: "Prohibit",
  },
  // ... continue with financial-specific terms
};
```

---

## 🚀 Quick Start Guide

1. **Complete your risk assessments** in the assessment section
2. **Visit the responses dashboard** to see your Risk Assessment Matrix
3. **Look for red dots** - these are your highest priority risks
4. **Check the summary cards** for overall statistics
5. **Review individual question cards** for detailed information
6. **Use the visual matrix** to identify patterns and focus areas
7. **Customize the matrix** using the code examples above to fit your organization's needs

The Risk Assessment Matrix transforms complex risk data into clear, actionable insights that help you protect your organization effectively!