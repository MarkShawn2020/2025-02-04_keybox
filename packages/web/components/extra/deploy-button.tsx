import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeployButton() {
  return (
    <>
      <Link
        href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMarkShawn2020%2F2025-02-04_keybox&project-name=keybox&repository-name=keybox&demo-title=KeyBox&demo-description=Next+generation+environment+variable+management+system+with+web+interface+and+CLI+tools%2C+making+configuration+management+simpler+and+more+secure.&demo-url=https%3A%2F%2Fkeybox.vercel.app"
        target="_blank"
      >
        <Button 
          variant="outline" 
          className="flex items-center gap-2 text-sm" 
          size={"sm"}
        >
          <svg
            className="h-3 w-3"
            viewBox="0 0 76 65"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" fill="inherit" />
          </svg>
          <span>Deploy</span>
        </Button>
      </Link>
    </>
  );
}
