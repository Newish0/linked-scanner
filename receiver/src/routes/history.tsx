import { createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/history"!</div>
}
