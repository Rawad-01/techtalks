import { Sparkles } from "lucide-react";
export function ConversationArt() {
  return (
    <div
      className="conversation-art"
      role="img"
      aria-label="An illustrated conversation: write, share, and grow together."
    >
      <div className="art-grid" />
      <div className="art-orbit" />
      <div className="art-note">
        <span>↳</span>Good ideas start a conversation.
      </div>
      <Sparkles className="art-spark" size={32} strokeWidth={1} />
      <div className="art-terminal">
        <div className="terminal-bar">
          <i />
          <i />
          <i />
          <span>hello-community.ts</span>
        </div>
        <div className="terminal-content">
          <p className="comment">{"// better, together."}</p>
          <p>
            <span className="violet">const</span> developer = {"{"}
          </p>
          <p className="indent">
            curiosity: <span className="green">&quot;always on&quot;</span>,
          </p>
          <p className="indent">
            knowledge: <span className="green">&quot;open source&quot;</span>,
          </p>
          <p className="indent">
            community: <span className="green">&quot;TechTalks&quot;</span>
          </p>
          <p>
            {"}"};<span className="violet">_</span>
          </p>
        </div>
      </div>
      <div className="art-reply">
        <div className="reply-label">THE BEST PART OF BUILDING?</div>
        <p>
          Finding people who
          <br />
          <span>get what you&apos;re building.</span>
        </p>
      </div>
      <span className="art-topic">[ ideas welcome. curiosity required. ]</span>
    </div>
  );
}
