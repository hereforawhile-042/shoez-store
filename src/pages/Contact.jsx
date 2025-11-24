import Layout from "@/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const Contact = () => {
  // Optional: basic submit handler without state
  const onSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! We’ll get back to you shortly.");
    e.target.reset();
  };

  return (
    <Layout noPadding={true}>
      <main className="mx-auto max-w-3xl px-12 pb-5">
        <h1 className="text-3xl font-semibold">Contact Us</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Questions about an order, returns, or sizing? Send us a message and we’ll get back to you.
        </p>

        {/* Quick contact info */}
        <ul className="mt-6 space-y-1 text-sm text-muted-foreground">
          <li><span className="font-medium text-foreground">Email:</span> support@shoestore.example</li>
          <li><span className="font-medium text-foreground">Phone:</span> +234 (0) 800 000 0000</li>
          <li><span className="font-medium text-foreground">Hours:</span> Mon–Fri, 9:00–18:00 WAT</li>
        </ul>

        {/* Simple form */}
        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
              <Input id="name" name="name" placeholder="Your full name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" placeholder="How can we help?" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message <span className="text-destructive">*</span></Label>
            <Textarea id="message" name="message" rows={6} placeholder="Write your message..." required />
          </div>

          <Button type="submit" className="w-full">Send Message</Button>
        </form>
      </main>
    </Layout>
  );
};

export default Contact;
