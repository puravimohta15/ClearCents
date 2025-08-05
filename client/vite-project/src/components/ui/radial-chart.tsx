// "use client"

// import { TrendingUp } from "lucide-react"
// import {
//   Label,
//   PolarGrid,
//   PolarRadiusAxis,
//   RadialBar,
//   RadialBarChart,
// } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import type { ChartConfig } from "@/components/ui/chart"
// import { ChartContainer } from "@/components/ui/chart"

// export const description = "A radial chart with a custom shape"

// const chartData = [
//   { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
// ]

// const chartConfig = {
//   budget: {
//     label: "Budget",
//   },
//   spent: {
//     label: "Spent",
//     color: "var(--chart-2)",
//   },
// } satisfies ChartConfig

// export function ChartRadialShape({
//   percent,
//   spent,
//   budget,
// }: {
//   percent: number
//   spent: number
//   budget: number
// }) {
//   const chartData = [
//     { name: "Spent", value: percent, fill: "#e5e7eb" },
//     { name: "Remaining", value: 100 - percent, fill: "#6366f1" },
//   ]

//   return (
//     <Card className="flex flex-col">
//       <CardHeader className="items-center pb-0">
//         <CardTitle>Budget Usage</CardTitle>
//         <CardDescription>
//           You have spent ₹{spent.toLocaleString()} of your ₹{budget.toLocaleString()} budget
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="flex-1 pb-0">
//         <ChartContainer
//           className="mx-auto w-[250px] h-[250px] max-w-full"
//           config={chartConfig}
//         >
//           <RadialBarChart
//             data={chartData}
//             startAngle={90}
//             endAngle={-270}
//             innerRadius={80}
//             outerRadius={140}
//           >
//             <PolarGrid gridType="circle" radialLines={false} stroke="none" />
//             <RadialBar
//               background
//               dataKey="value"
//               cornerRadius={10}
//             />
//             <PolarRadiusAxis
//               type="number"
//               domain={[0, 100]}
//               tick={false}
//               axisLine={false}
//             />
//             <Label
//               position="center"
//               content={({ viewBox }) => {
//                 if (viewBox && "cx" in viewBox && "cy" in viewBox) {
//                   return (
//                     <text
//                       x={viewBox.cx}
//                       y={viewBox.cy}
//                       textAnchor="middle"
//                       dominantBaseline="middle"
//                     >
//                       <tspan
//                         x={viewBox.cx}
//                         y={viewBox.cy}
//                         className="fill-foreground text-4xl font-bold"
//                       >
//                         {percent.toFixed(0)}%
//                       </tspan>
//                       <tspan
//                         x={viewBox.cx}
//                         y={(viewBox.cy || 0) + 24}
//                         className="fill-muted-foreground"
//                       >
//                         Used
//                       </tspan>
//                     </text>
//                   )
//                 }
//               }}
//             />
//           </RadialBarChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { Calendar22 } from "./date-picker"

export const description = "A radial chart with a custom shape"

const chartData = [
  { browser: "safari", visitors: 1260, fill: "var(--color-safari)" },
]

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function ChartRadialShape({
  percent,
  spent,
  budget,
}: {
  percent: number
  spent: number
  budget: number
}) {
  const num = (percent/100)*360;
  console.log("Num: " + num)
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Budget Usage</CardTitle>
        <CardDescription>You have spent ₹{spent.toLocaleString()} of your ₹{budget.toLocaleString()} budget</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={90-num}
            innerRadius={82}
            outerRadius={102}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[90, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {percent.toLocaleString()}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Used
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
