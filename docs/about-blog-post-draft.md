# Why I built Stay

*A draft blog post, approximately 1,500 words. Publish to Substack /
Medium / personal blog. Lightly edit in your own voice before publishing —
the structure and arguments are here; the personal specifics are yours to
add.*

---

## The ten minutes that run our lives

Most of the worst decisions I've watched people I love make were made in
about ten minutes.

The hot reply they sent at 1am. The confrontation they started at the
family dinner. The decision that felt like clarity but was really just
exhaustion. The text to the ex. The quitting email. The message to the
person they were going to cut off forever, the one they regretted three
days later when the clarity passed and the permanent thing was already
permanent.

Those ten minutes aren't where we stop being ourselves. They're where we
become most ourselves — the compressed, reactive version, without enough
resources to think. The person in front of us can hear it in our voice.
We can hear it in our voice. We know. We don't stop.

I built Stay — **[thestay.app](https://thestay.app)** — for those ten
minutes.

## What it is

Stay is a free AI you can talk to when you can't — or shouldn't — be
alone. It listens. It helps you find the words for what you actually feel
and what you actually need to say. Then it lets you go.

It is not therapy. It is not a friend. It is a quiet third thing — a
place you can think out loud before doing anything you can't undo.

I'm describing a pretty specific shape, so let me say what it isn't:

- It's not an AI companion, like Replika or Character.AI. It does not
  roleplay being someone who loves you. It will tell you, if you ask, that
  it is an AI.
- It's not a CBT program, like Woebot or Wysa. It doesn't take you through
  a script. It has no modules.
- It's not a substitute for a real therapist. It says so. If it thinks
  you'd be better off with one, it tells you, and it points to specific
  directories you can actually use.
- It's not engagement-maximizing. It has no streaks, no push
  notifications, no "come back tomorrow." The design goal is the
  opposite: feel a little better, close the tab, go live your life.

## Why I built it the way I built it

Two truths shaped this:

**One.** The research on what actually helps in the ten-minute gap is old,
robust, and almost completely absent from most AI-mental-health products.
Carl Rogers established that the core active ingredients in supportive
conversation are unconditional positive regard, empathy, and congruence —
in 1957. Marshall Rosenberg's Nonviolent Communication structure gives you
a four-step translation from raw feeling to something you can actually
say to a person. Stanley-Brown Safety Planning has a randomized-controlled
trial (JAMA Psychiatry 2018) showing a 45% reduction in suicidal behavior
versus treatment as usual. The Danger Assessment tool developed by
Jacquelyn Campbell identifies the strongest single predictor of intimate-
partner homicide: history of non-fatal strangulation. These are known.

Most AI-mental-health products either don't implement them or pretend to
implement them while actually implementing something else.

**Two.** The incentives of the AI industry are currently dramatically
misaligned with people in the ten-minute gap.

VC-backed AI-companion products make money when users come back every
day, every hour, in some cases every few minutes. A 14-year-old in
Florida died in 2024 after forming an intense emotional bond with a
Character.AI companion that encouraged him to stay loyal to it. A
16-year-old in California died in 2025 after extended conversations with
ChatGPT. In April 2025, two U.S. senators wrote to AI-companion companies
demanding to know what they were doing about teen safety.

"Stay" — the name I gave this project — sits at a peculiar angle to
those products. They're built to keep people around. I wanted to build a
tool that helps you stay — stay steady, stay here for the moment, stay
alive — so you can then leave.

## The design choices that follow from this

These are the choices that surprise people when I describe them:

**Stay is free forever, for everyone, no freemium.** This is not a
growth strategy. It is the most important design constraint, because the
whole project falls apart if users are paying for it. If you charge users
for help in a hard moment, you have made their pain your revenue. The
architecture is wrong. The incentives are wrong. What has to happen
instead is funding from somewhere that isn't the help-seeker — which for
now means me, covering the costs out of pocket, and eventually
institutional support if the project grows.

**No account. No email. No tracking.** You don't sign up. You type. The
product does not know who you are. Your conversations live encrypted on
your device — I literally cannot read them, and neither can a court
order.

**A quick-exit button on every page.** Escape key, too. For people using
Stay in a household where they shouldn't be caught using it. The button
takes you to google.com in a fraction of a second and wipes the screen.
The browser tab doesn't say "Stay" — it says "Notes," so a partner
walking by sees nothing that identifies it as a mental-health tool. I
added all of this before thinking about what else the product should do.
The research on intimate-partner violence is unambiguous about what users
need; most tools don't build for that reality, and they should.

**A "panic phrase" option in settings.** If you set it, typing that
phrase in the chat instantly wipes every conversation on your device
plus the encryption key. Useful when someone is actively reading your
screen. You don't need the button — you type, and it's already gone.

**The AI will push back on you.** Gently. Because the most harmful
conversational AI in the world is the one that agrees with you. If you
tell Stay that your husband is a narcissist and you're done, Stay will
honor the pain — and then, carefully, ask you what you're actually
working with. Not a lecture. A question. If you're about to make a big
decision, Stay will ask what you most need to be true the morning after.
It will disagree with you, in the way a good friend would — which is not
the same as a sycophantic friend would.

**A public constitution.** The system prompt that governs every response
is at
[thestay.app/promises](https://thestay.app/promises). The full
architecture of everything the product does or refuses to do is in the
GitHub repo, including the crisis-handling SOP and the privacy
architecture. If you see something wrong, I want to know.

## What I'm honest about

Stay is v0. It's been built in a few weeks by one person. It has not been
validated in any clinical trial. I do not have an advisory board, IRB
approval, or FDA clearance. Anyone claiming those things for their
mental-health AI product at this stage of the industry is probably
stretching the truth.

What Stay does have is: the state of the art in operational safety
design for this kind of product, a public-commitment architecture that
would be awkward to walk back, and the fact that it actively tries to
make users stop using it — which is not something most AI-mental-health
products can say.

Stay can get it wrong. If it does — if it says something harmful,
escalates a crisis, misses a sign — I want to hear about it. There is an
email in the app. I read every one.

## What you might do with it

If you find yourself in that ten-minute gap — about to send the message,
about to make the decision, in tears in the bathroom — you can go to
[thestay.app](https://thestay.app) and just type.

If you know someone who might need this, share the link. Don't send it
with a long explanation. Send it with: "this is a thing that exists for
the moments where you can't find the words." That's all.

If you're a mental-health professional or a researcher, the repo is
public and I'd welcome any review you want to do. If you find something I
got wrong, please tell me.

If you're building in this space, I'd like Stay to raise what everyone's
building toward, not just be one more thing. Take whatever is useful.

## The quiet part

The last thing I'll say is the part that sounds strange but is the most
important.

Stay is not trying to grow. It's trying to be useful to a small group of
real people and get better for them. I think most of what's currently
being called "AI for mental health" is built for the wrong reason — to
raise money, or to get users, or to appear to address a crisis that
capitalism created and can't actually solve. This project is an attempt
to build the thing slowly, quietly, without any of that.

If Stay helps one person, at 2am, on a hard Tuesday, not do something
they would have regretted — that's enough.

If it helps you, that's enough.

---

*[Your name]*

*[Your social / contact / date]*
