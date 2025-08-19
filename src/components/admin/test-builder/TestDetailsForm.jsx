import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function TestDetailsForm({
  testTitle,
  setTestTitle,
  testDescription,
  setTestDescription,
  testType,
  setTestType,
  testDuration,
  setTestDuration,
  passingScore,
  setPassingScore,
  visibility,
  setVisibility,
  shuffleQuestions,
  setShuffleQuestions,
  showResultsImmediately,
  setShowResultsImmediately,
  dueDate,
  setDueDate,
  scheduledDate,
  setScheduledDate,
}) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Test Title *</Label>
            <Input
              id="title"
              placeholder="Enter test title"
              value={testTitle}
              onChange={(e) => setTestTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Test Type</Label>
            <Select value={testType} onValueChange={setTestType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">
                  Multiple Choice Only
                </SelectItem>
                <SelectItem value="mixed">Mixed Question Types</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter test description"
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes) *</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="60"
              value={testDuration}
              onChange={(e) => setTestDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="passingScore">Passing Score (%) *</Label>
            <Input
              id="passingScore"
              type="number"
              min="0"
              max="100"
              placeholder="70"
              value={passingScore}
              onChange={(e) => setPassingScore(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private">Private</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : "Select due date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate || undefined}
                  onSelect={(date) => setDueDate(date || null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {visibility === "scheduled" && (
            <div className="space-y-2">
              <Label>Scheduled Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate
                      ? format(scheduledDate, "PPP")
                      : "Select scheduled date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate || undefined}
                    onSelect={(date) => setScheduledDate(date || null)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Shuffle Questions</Label>
              <p className="text-sm text-muted-foreground">
                Randomize the order of questions for each test taker
              </p>
            </div>
            <Switch
              checked={shuffleQuestions}
              onCheckedChange={setShuffleQuestions}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Results Immediately</Label>
              <p className="text-sm text-muted-foreground">
                Display results to students immediately after submission
              </p>
            </div>
            <Switch
              checked={showResultsImmediately}
              onCheckedChange={setShowResultsImmediately}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
