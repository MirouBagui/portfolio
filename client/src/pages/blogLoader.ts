export interface BlogPost {
  id: string
  title: string
  excerpt: string
  tags?: string[]
}

export async function blogLoader(): Promise<BlogPost[]> {
  return [
    {
      id: '1',
      title: 'Real-Time Systems at Scale: Lessons from F1',
      excerpt:
        'Architecting event orchestration for 50k+ concurrent data points with sub-50ms latency.',
      tags: ['real-time', 'architecture', 'f1'],
    },
    {
      id: '2',
      title: 'Building a WebRTC Platform from Scratch',
      excerpt:
        'Lessons learned designing and shipping a real-time video messaging platform.',
      tags: ['webrtc', 'fullstack', 'architecture'],
    },
  ]
}
