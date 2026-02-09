import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            shadcn/ui 예시
          </h1>
          <p className="text-muted-foreground">
            Button과 Card 컴포넌트를 사용한 간단한 데모입니다.
          </p>
        </header>

        {/* Button variants */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Button 변형</h2>
          <div className="flex flex-wrap gap-3">
            <Button>기본</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Card 컴포넌트</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>첫 번째 카드</CardTitle>
                <CardDescription>
                  shadcn Card의 Header, Title, Description입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  CardContent 영역입니다. 여기에 본문 내용을 넣을 수 있습니다.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">자세히 보기</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>두 번째 카드</CardTitle>
                <CardDescription>
                  버튼과 함께 사용하는 카드 예시입니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Footer에 여러 버튼을 배치할 수 있습니다.
                </p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm">
                  취소
                </Button>
                <Button size="sm">확인</Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
