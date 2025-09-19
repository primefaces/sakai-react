'use client';

import { useParams } from "next/navigation";

export default function VideoLesson() {
  const {video_url} = useParams();
  console.log(video_url);
  
  return <div>page</div>;
}
