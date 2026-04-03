# QuiRamèneQuoi - SEO Action Plan
**Prioritized Recommendations** | April 3, 2026 | Overall Health: 48/100 → Target: 75/100

---

## Quick Reference: Priority Matrix

```
CRITICAL & IMMEDIATE (Fix this week)
├── Legal Compliance ⚠️ GDPR Risk
├── Dynamic Metadata 🔴 SEO Block
├── Remove "Data Sale" Language 🔴 Trust Risk
└── Basic JSON-LD Schema 🔴 Rich Results

HIGH IMPACT & Important (Weeks 2-3)
├── Privacy Policy & Terms of Service
├── About Page (Author Credentials)
├── FAQ Page (10-15 Q&A)
├── Getting Started Guide
├── Font-Display Optimization
└── Core Web Vitals Monitoring

MEDIUM IMPACT (Month 2)
├── Use Case Guides (3-5)
├── Blog Section (2-4 articles)
├── Code-Split JavaScript
├── Remove Unused JS (54KiB)
├── Font Optimization (subsetting)
└── User Testimonials

NICE TO HAVE (Month 3+)
├── Press Outreach
├── Social Media Links
├── Newsletter Signup
├── Advanced Analytics
├── Video Walkthroughs
└── Interactive Templates
```

---

## CRITICAL: Week 1 (3-4 hours)

### ✅ Task 1: Fix Data Disclosure Language (30 min)
**Risk Level:** CRITICAL  
**File:** `app/[id]/page.tsx`

**Current problematic text:**
```
"En cliquant sur «Créer une liste», vous consentez au stockage et 
à la vente de vos données de manière anonyme pour une durée de 2 ans."
```

**Replace with:**
```
"Nous utilisons vos données de manière anonyme pour 2 ans pour améliorer 
le service. Consultez notre politique de confidentialité pour plus d'infos."
```

**Then create Privacy Policy (Task 2).**

**Impact:** Removes legal liability immediately

---

### ✅ Task 2: Create Privacy Policy (1.5 hours)
**Risk Level:** CRITICAL  
**File:** Create `app/privacy/page.tsx`

**Minimum sections:**
1. **What data we collect**
   - Lists created
   - Items added
   - IP address/device info
   - No cookies by default

2. **How we use it**
   - Service improvement (anonymized analytics)
   - Retention: 2 years (as currently disclosed)
   - No sale of data (if true - remove "sale" language)

3. **Your rights**
   - Right to deletion (GDPR Article 17)
   - Right to portability (GDPR Article 20)
   - Right to object (GDPR Article 21)

4. **Contact**
   - Email for data requests
   - Response time: 30 days

**Template location:** Common GDPR privacy policy templates online
**Language:** French + English

**Code:**
```typescript
// app/privacy/page.tsx
export const metadata = {
  title: 'Privacy Policy - QuiRamèneQuoi',
  description: 'Our privacy policy and data handling practices'
};

export default function PrivacyPolicy() {
  return (
    <div className="prose max-w-2xl mx-auto">
      <h1>Privacy Policy</h1>
      {/* Content here */}
    </div>
  );
}
```

**Impact:** GDPR compliance; restores user trust

---

### ✅ Task 3: Create Terms of Service (1.5 hours)
**Risk Level:** HIGH  
**File:** Create `app/terms/page.tsx`

**Minimum sections:**
1. Acceptable use (no malicious content)
2. Liability limitations
3. List retention policy
4. User responsibilities
5. Dispute resolution

**Impact:** Legal protection; clarity for users

---

### ✅ Task 4: Dynamic Metadata in Dynamic Pages (1 hour)
**Risk Level:** HIGH  
**File:** `app/[id]/page.tsx`

**Current state:** All pages identical metadata
**Target state:** Unique title/description per list

**Implementation:**

```typescript
// app/[id]/page.tsx

export async function generateMetadata({ params }): Promise<Metadata> {
  const list = await getList(params.id);
  
  const itemTitles = list.items.slice(0, 5)
    .map(item => item.title)
    .join(', ');
  
  const description = `${list.title}: ${itemTitles}${list.items.length > 5 ? '...' : ''}`;

  return {
    title: `${list.title} - QuiRamèneQuoi`,
    description: description,
    openGraph: {
      title: `${list.title} - QuiRamèneQuoi`,
      description: description,
      type: 'website',
      url: `https://quiramenequoi.fr/${params.id}`
    },
    twitter: {
      card: 'summary',
      title: `${list.title} - QuiRamèneQuoi`,
      description: description
    }
  };
}
```

**Impact:** Each list becomes uniquely indexable; +8 SEO points

---

### ✅ Task 5: Add Basic JSON-LD Schema (45 min)
**Risk Level:** HIGH  
**File:** `app/layout.tsx`

**Add to `<head>` section:**

```typescript
// In your layout component, add this in the head

import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <Script
          id="schema-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'QuiRamèneQuoi',
              url: 'https://quiramenequoi.fr',
              logo: 'https://quiramenequoi.fr/logo.png',
              description: 'L\'application simple pour gérer les listes de courses et d\'organisation pour vos soirées'
            })
          }}
        />
        
        <Script
          id="schema-software-app"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'QuiRamèneQuoi',
              applicationCategory: 'ProductivityApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'EUR'
              }
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**Test:** https://search.google.com/test/rich-results

**Impact:** Enables rich snippet eligibility; +5 points

---

## HIGH PRIORITY: Weeks 2-3 (5-6 hours)

### ✅ Task 6: Create /about Page (2 hours)
**File:** Create `app/about/page.tsx`  
**Target:** 500-800 words

**Content structure:**
```
1. Your Story (150 words)
   - Who you are
   - Background/expertise
   - Why you built QuiRamèneQuoi
   
2. The Problem You Solved (100 words)
   - What frustration inspired this
   - How people organized before
   
3. The Solution (150 words)
   - How QuiRamèneQuoi works
   - Key features
   - Why it's different
   
4. Your Vision (100 words)
   - Where this is heading
   - Commitment to users
   
5. Contact (50 words)
   - Email/contact form
   - Social links
```

**Impact:** +8 E-E-A-T points; builds author credibility

---

### ✅ Task 7: Create /faq Page (2 hours)
**File:** Create `app/faq/page.tsx`  
**Target:** 1,200-1,500 words, 10-15 Q&As

**Questions to include:**
1. What is QuiRamèneQuoi?
2. How do I create a list?
3. How do I share my list?
4. Can guests edit my list?
5. What if someone removes an item I assigned?
6. How long are lists stored?
7. Can I delete a list?
8. Is my data private?
9. Do I need to create an account?
10. Does it work on mobile?
11. Can I access lists offline?
12. Is there an API?
13. What's your privacy policy?
14. How much does it cost?
15. Can I export my lists?

**Format:**
```typescript
// app/faq/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - QuiRamèneQuoi',
  description: 'Frequently asked questions about QuiRamèneQuoi'
};

export default function FAQ() {
  const faqs = [
    {
      question: 'What is QuiRamèneQuoi?',
      answer: '...'
    },
    // ... more items
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1>Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Impact:** +5 points; improves featured snippet eligibility

---

### ✅ Task 8: Create Getting Started Guide (1.5 hours)
**File:** Create `app/guide/page.tsx`  
**Target:** 1,500-2,000 words

**Sections:**
1. **Overview** - What this guide covers (100 words)
2. **Creating Your First List** (300 words)
   - Step-by-step with visuals (text descriptions)
3. **Adding Items** (250 words)
   - Item types
   - Optional quantities
4. **Sharing Your List** (250 words)
   - How to get the link
   - Multiple sharing methods
5. **Managing Responses** (250 words)
   - Viewing commitments
   - Editing items
6. **Tips & Best Practices** (200 words)
   - Organization ideas
   - Common patterns
7. **Troubleshooting** (150 words)
   - Common issues
   - How to get support

**Impact:** +3 points; improves user satisfaction

---

### ✅ Task 9: Font-Display Optimization (30 min)
**File:** `app/layout.tsx`

**Change:**
```typescript
// FROM
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap" />

// TO
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;900&display=swap&font-display=swap" />
```

Or use:
```typescript
import { Nunito, Syne } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap', // Add this
});

const syne = Syne({
  subsets: ['latin'],
  display: 'block', // For headers
});
```

**Impact:** -100 to -150ms LCP

---

### ✅ Task 10: Setup Core Web Vitals Monitoring (30 min)
**URL:** https://pagespeed.web.dev/?url=https://quiramenequoi.fr

**Actions:**
1. Run PageSpeed Insights monthly
2. Record LCP, INP, CLS metrics
3. Check Search Console for real-world data
4. Set alerts for regressions

**Impact:** Baseline for performance optimization

---

## MEDIUM PRIORITY: Month 2 (8-10 hours)

### ✅ Task 11: Create Use Case Guides (4-6 hours)
**Create 3-5 separate pages:**

1. **Birthday Party Planning** - `app/guide/birthday/page.tsx`
   - Typical items needed
   - Decoration/food/drink allocation
   - Timeline example
   
2. **Picnic Organization** - `app/guide/picnic/page.tsx`
   - Food categories
   - Equipment coordination
   - Cleanup responsibility
   
3. **Family Reunion** - `app/guide/family-reunion/page.tsx`
   - Multi-family delegation
   - Accommodation needs
   - Activity organization
   
4. **Potluck Party** - `app/guide/potluck/page.tsx`
   - Cuisine types
   - Storage/heating considerations
   - Timing coordination
   
5. **Weekend Getaway** - `app/guide/getaway/page.tsx`
   - Lodging coordination
   - Activities assignment
   - Meal planning

**Target:** 1,500-2,000 words each

**Impact:** +10 points; establishes expertise in multiple domains

---

### ✅ Task 12: Launch Blog Section (2-3 hours)
**Create:** `app/blog/[slug]/page.tsx`

**Initial articles (1,500-2,500 words each):**

1. **5 Tips for Successful Event Organization**
   - Original insights
   - Expert commentary
   
2. **The Psychology of Shared Responsibility**
   - Why delegation matters
   - Research + examples
   
3. **Event Planning Tool Comparison**
   - Honest evaluation
   - QuiRamèneQuoi positioning
   
4. **Common Party Planning Mistakes**
   - Real problems
   - Solutions and prevention
   
5. **Seasonal Event Planning Guide**
   - Holiday coordination
   - Summer/winter events

**Cadence:** 1-2 posts/month minimum

**Impact:** +8 points; enables thought leadership

---

### ✅ Task 13: Remove Unused JavaScript (2-3 hours)
**Files:** `app/layout.tsx`, `/next.config.ts`

**Current issue:** 54 KiB unused JS (74.5% of one chunk)

**Solution:** Code-split Radix UI components

```typescript
// BEFORE (Bad)
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';

export default function Layout() {
  return <DropdownMenu>...</DropdownMenu>;
}

// AFTER (Good)
import dynamic from 'next/dynamic';

const DropdownMenu = dynamic(
  () => import('@radix-ui/react-dropdown-menu'),
  { ssr: false }
);

export default function Layout() {
  return <DropdownMenu>...</DropdownMenu>;
}
```

**Files to audit:**
- `/app/layout.tsx` - Remove global imports
- `/app/[id]/page.tsx` - Import components locally
- All component files with Radix UI

**Impact:** -470ms LCP, -54 KiB transfer

---

### ✅ Task 14: Font Optimization (1-2 hours)
**File:** `app/layout.tsx`

**Options (pick one):**

**Option A: Font Subsetting (easiest)**
```typescript
// Only load Latin characters for Nunito
const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap'
});
```
**Expected saving:** 20-30% (10-15 KiB)

**Option B: Variable Fonts (best)**
```typescript
import { Nunito_Sans, Syne } from 'next/font/google';

const nunito = Nunito_Sans({
  variable: '--font-nunito-sans',
  display: 'swap'
});

const syne = Syne({
  variable: '--font-syne',
  display: 'block'
});
```
**Expected saving:** 30-40% (15-20 KiB)

**Option C: Reduce Font Weights**
- Use only weights needed: 400, 700, 900
- Don't load all weights

**Impact:** -100-200ms LCP, -30-50 KiB transfer

---

### ✅ Task 15: Add User Testimonials (1 hour)
**Location:** Add section to homepage or `/testimonials` page

**Collect from:**
- Beta testers/early users
- Friends who've used it
- Social media feedback

**Format:**
```
"Saved us 30 minutes coordinating who brings what for our dinner"
— Marie, Paris 🇫🇷

"Finally a simple way to organize potlucks!"
— Lucas, Lyon 🇫🇷
```

**Target:** 5-10 testimonials minimum

**Impact:** +6 trust points

---

## OPTIONAL: Month 3+ (Nice to Have)

- [ ] Press outreach to French tech blogs
- [ ] Twitter/LinkedIn presence
- [ ] YouTube tutorial videos
- [ ] Event planning checklist templates
- [ ] Newsletter for event tips
- [ ] Internationalization (English, Spanish, German)
- [ ] Mobile app (PWA or native)

---

## Implementation Checklist

### Week 1
- [ ] Fix data disclosure language
- [ ] Create Privacy Policy
- [ ] Create Terms of Service
- [ ] Implement dynamic metadata
- [ ] Add JSON-LD schema
- [ ] Deploy changes

### Week 2
- [ ] Create /about page
- [ ] Create /faq page
- [ ] Create /guide page
- [ ] Optimize font display
- [ ] Run PageSpeed Insights
- [ ] Deploy changes

### Week 3
- [ ] Review Search Console
- [ ] Test rich results
- [ ] Collect testimonials
- [ ] Plan use case guides

### Month 2
- [ ] Create use case guides (3-5)
- [ ] Launch blog
- [ ] Code-split JavaScript
- [ ] Optimize fonts further
- [ ] Monthly CWV check

### Month 3+
- [ ] Add testimonials section
- [ ] Press outreach
- [ ] Advanced optimization
- [ ] Plan next features

---

## Expected Score Progression

| Phase | Timeline | Expected Score | Improvement |
|-------|----------|---|---|
| Current | Now | 48/100 | Baseline |
| Phase 1 | Week 1 | 55/100 | +7 |
| Phase 2 | Week 2-3 | 62/100 | +7 |
| Phase 3 | Month 2 | 70/100 | +8 |
| Phase 4 | Month 3 | 75+/100 | +5+ |

---

## Success Metrics

Track these monthly:
- [ ] Google PageSpeed Insights LCP score
- [ ] Search Console indexation count
- [ ] Core Web Vitals (CrUX data)
- [ ] Backlink count
- [ ] Brand search volume
- [ ] Organic traffic (if tracked)
- [ ] User-generated content growth

---

**Plan Created:** April 3, 2026  
**Next Review:** April 10, 2026 (Week 1 checkpoint)
