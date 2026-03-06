import { Check, Share2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackButton } from "@/components/back/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import * as Icons from "@/components/icons";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: Params) {
  const { id } = await params;

  const performanceMetrics = [
    {
      title: "Fluency & Coherence",
      score: 78,
      description: "Natural flow, good pace",
      color: "bg-green-500",
    },
    {
      title: "Grammar & Accuracy",
      score: 38,
      description: "A lot article errors",
      color: "bg-red-500",
    },
    {
      title: "Task Achievement",
      score: 86,
      description: "Addressed all questions well",
      color: "bg-green-500",
    },
    {
      title: "Pronunciation",
      score: 78,
      description: "Clear articulation, good stress",
      color: "bg-yellow-500",
    },
    {
      title: "Vocabulary Range",
      score: 89,
      description: "Good topic-specific words",
      color: "bg-green-500",
    },
    {
      title: "Interaction & Response",
      score: 74,
      description: "Good engagement level",
      color: "bg-green-500",
    },
  ];

  const strengths = [
    'Clear pronunciation of important words like "sustainability" and "biodiversity"',
    "You speak naturally with good pauses and tone",
    'Good use of present perfect tense (e.g., "I have recycled bottles")',
    'You connect ideas well using words like "also", "but", and "because"',
    "You speak confidently with little hesitation",
  ];

  const improvements = [
    'Small grammar fix: say "I always use reusable bags" (not "the reusable bags")',
    'Great use of prepositions: "walk instead of driving" is correct!',
    'Try using longer sentences by joining ideas together with words like "because" or "and"',
    "Learn and use more new environmental words in your speaking and writing",
  ];

  const studyPlan = [
    "Grammar: Do 15 minutes of reading or grammar tasks every day",
    "Vocabulary: Learn 5 new environment-related words daily",
    "Listening: Watch BBC Nature or other documentaries for 20 minutes a day",
    "Speaking: Practice speaking by recording yourself talking about daily eco-habits",
  ];

  const analysis = {
    achievement: [
      {
        title: "Words Spoken",
        value: "156",
      },
      {
        title: "Speaking Time",
        value: "3:24",
      },
      {
        title: "Accuracy Rate",
        value: "92%",
      },
      {
        title: "Avg Response Time",
        value: "2.1s",
      },
    ],
    hightlights: [
      {
        title: "Sustainability",
        value: "Perfect",
        color: "bg-green-200 text-green-700",
      },
      {
        title: "Environment",
        value: "Excellent",
        color: "bg-blue-200 text-blue-700",
      },
      {
        title: "Accessible",
        value: "Good",
        color: "bg-yellow-200 text-yellow-700",
      },
    ],
    vocabulary: [
      "Sustainability",
      "Renewable energy",
      "Carbon footprint",
      "Biodiversity",
      "Conservation",
      "Eco-friendly",
    ],
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Back Button */}
      <div className="w-max">
        <BackButton />
      </div>

      <div className="w-full lg:w-4xl mx-auto">
        <div className="flex flex-col justify-center items-center gap-6 w-full">
          {/* Results Section */}
          <div className="flex flex-col items-center justify-between w-full">
            <div className="flex flex-col items-center gap-2 w-full relative">
              <h2 className="text-lg font-medium text-gray-600">Your result</h2>
              <div className="absolute top-0 right-0">
                <Button variant="outline" size="sm" className="rounded-full">
                  <Icons.Share fill="black" className="w-4 h-4" />
                  Share Progress
                </Button>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl font-bold text-gray-900">9</span>
                <span className="text-4xl text-gray-400">/10</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-blue-100 text-blue-700 mb-2"
              >
                Intermediate
              </Badge>
              <p className="text-sm text-gray-500">
                +2 points from last session
              </p>
            </div>
          </div>

          {/* Performance Metrics */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">
                        {metric.title}
                      </h3>
                      <span className="text-sm font-medium text-gray-900">
                        {metric.score}%
                      </span>
                    </div>
                    <Progress
                      value={metric.score}
                      indicatorClassName={metric.color}
                    />
                    <p className="text-sm text-gray-600">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Detailed Feedback */}
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Detailed Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-xs">✅</span>
                  <h3 className="font-medium text-gray-900">
                    Strengths & Achievement
                  </h3>
                </div>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li
                      key={`strength-${index}`}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-xs">📝</span>
                  <h3 className="font-medium text-gray-900">
                    Areas for Improvement
                  </h3>
                </div>
                <ul className="space-y-2">
                  {improvements.map((improvement, index) => (
                    <li
                      key={`improvement-${index}`}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-white text-xs">📚</span>
                  <h3 className="font-medium text-gray-900">
                    Personalized Study Plan
                  </h3>
                </div>
                <ul className="space-y-2">
                  {studyPlan.map((plan, index) => (
                    <li
                      key={`plan-${index}`}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{plan}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Analysis */}
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>Conversation Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">
                  Strengths & Achievement
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {analysis.achievement.map((achievement, index) => (
                    <div
                      key={`achievement-${index}`}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border"
                    >
                      <span className="text-3xl font-semibold text-gray-900">
                        {achievement.value}
                      </span>
                      <span className="text-sm font-light text-gray-900">
                        {achievement.title}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">
                    Pronunciation Highlights
                  </h3>
                  <div className="flex flex-row gap-4">
                    {analysis.hightlights.map((highlight) => (
                      <div
                        key={`highlight-${highlight.title}`}
                        className="flex flex-row gap-2"
                      >
                        <div className="flex flex-row gap-2">
                          <h5 className="font-light text-sm ">
                            {highlight.title}
                          </h5>
                          <Badge
                            variant="secondary"
                            className={cn(highlight.color, "rounded-full")}
                          >
                            {highlight.value}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Vocabulary Used</h3>
                  <div className="flex flex-row gap-4 flex-wrap">
                    {analysis.vocabulary.map((vocabulary) => (
                      <div
                        key={`vocabulary-${vocabulary}`}
                        className="flex flex-row gap-2"
                      >
                        <Badge variant="secondary">{vocabulary}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p>6 topic-specific terms used correctly</p>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="w-full gap-2">
            <CardHeader>
              <CardTitle>🏆 Achievements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 w-full">
              <div className="flex flex-row gap-4 w-full">
                <div className="bg-green-100  p-4 rounded-xl w-full">
                  <h3 className="font-medium text-green-700 text-base">
                    Conversation Master
                  </h3>
                  <p className="font-light text-sm">
                    Completed 5 speaking sessions
                  </p>
                </div>
                <div className="bg-blue-100  p-4 rounded-xl w-full">
                  <h3 className="font-medium text-blue-900 text-base">
                    Eco Vocabulary Expert
                  </h3>
                  <p className="font-light text-sm">
                    Mastered environmental terms
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-row gap-4 w-full">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>📈 Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Weekly Goal</span>
                      <span className="text-xs">4/5 sessions</span>
                    </div>
                    <Progress
                      value={(4 / 5) * 100}
                      indicatorClassName="bg-slate-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs">Monthly Target</span>
                      <span className="text-xs">12/20 sessions</span>
                    </div>
                    <Progress
                      value={(12 / 20) * 100}
                      indicatorClassName="bg-slate-700"
                    />
                  </div>
                  <div className="bg-blue-200 text-blue-200 rounded-xl p-4">
                    <h4 className="text-sm font-semibold text-blue-950">
                      Next Milestone
                    </h4>
                    <p className="text-xs font-light text-blue-950">
                      8 more sessions to reach B2+ level
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <h3>🎯 Learning Goals</h3>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="stroke-blue-500 size-4" />
                    <span className="text-sm">
                      Master present perfect tense
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="stroke-blue-500  size-4" />
                    <span className="text-sm">Improve article usage</span>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="stroke-blue-500 opacity-0  size-4" />
                    <span className="text-sm">
                      Learn complex sentence structures
                    </span>
                  </div>
                  <div className="flex flex-row gap-2 items-center">
                    <Check className="stroke-blue-500 opacity-0  size-4" />
                    <span className="text-sm">Expand academic vocabulary</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full grid grid-cols-3 gap-4">
            <Link
              href={"/"}
              className={buttonVariants({
                variant: "secondary",
                className:
                  "border w-full col-span-1 rounded-full! text-lg! leading-6! h-auto! px-10!",
              })}
            >
              Study Plan
            </Link>
            <Link
              href={`/conversation/${id}`}
              className={buttonVariants({
                variant: "secondary",
                className:
                  "border w-full col-span-1 rounded-full! text-lg! leading-6! h-auto! px-10!",
              })}
            >
              Learn Again
            </Link>
            <Link
              href={`/topic/${id}`}
              className={buttonVariants({
                variant: "secondary",
                className:
                  "bg-gradient-orange border w-full col-span-1 rounded-full! text-lg! leading-6! h-auto! px-10! text-white",
              })}
            >
              Pratice New Topic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
