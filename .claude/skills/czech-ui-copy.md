---
name: czech-ui-copy
description: Use whenever writing or modifying user-facing strings — JSX text content, button labels, form labels, error messages, modal titles, placeholders, aria-labels, page metadata. All visible AURA UI is Czech, formal "vy" form, design-led tone. Auto-invoke on any TSX edit that adds or changes string literals shown to the user.
---

# Czech UI Copy — AURA standards

All user-visible text in the AURA Homes Experience is Czech. Identifiers,
comments, console logs, and commit messages stay English.

## Tone

- Warm, calm, design-led. AURA sells craft and considered design — copy
  reflects that.
- Formal "vy" throughout. Never "ty" / "tvůj".
- No hype words: avoid "úžasný", "revoluční", "neskutečný", "WOW".
- No emojis.
- Sentences are short. Periods, not exclamation marks (one allowed in
  the entire app, max).

## Standardized phrases (use these, not synonyms)

| English idea            | AURA Czech                          |
| ----------------------- | ----------------------------------- |
| Submit / Send           | Odeslat                             |
| Submit form             | Odeslat poptávku                    |
| Get a quote             | Nezávazná poptávka                  |
| Continue                | Pokračovat                          |
| Back                    | Zpět                                |
| Close                   | Zavřít                              |
| Cancel                  | Zrušit                              |
| Save                    | Uložit                              |
| Loading…                | Načítání…                           |
| Required field          | Povinné pole                        |
| Optional                | Nepovinné                           |
| Name                    | Jméno                               |
| Full name               | Jméno a příjmení                    |
| Email                   | E-mail                              |
| Phone                   | Telefon                             |
| Message                 | Zpráva                              |
| Floor plan              | Půdorys                             |
| Living room             | Obývací pokoj                       |
| Bedroom                 | Ložnice                             |
| Bathroom                | Koupelna                            |
| Utility room            | Technická místnost                  |
| Front view / Exterior   | Pohled zepředu / Exteriér           |
| Facade                  | Fasáda                              |
| Dark facade             | Tmavá fasáda                        |
| Light facade            | Světlá fasáda                       |
| Terrace                 | Terasa                              |
| Pergola                 | Pergola                             |
| None                    | Žádná                               |
| Small                   | Malá                                |
| Large                   | Velká                               |
| Yes / No                | Ano / Ne                            |
| Price                   | Cena                                |
| From <X>                | Od <X>                              |
| Total                   | Celkem                              |
| Coming soon             | Připravujeme                        |

## Number, currency, date formatting

Always use Intl with `cs-CZ` locale. Wrap in `lib/format.ts` helpers:

```ts
formatPrice(4_850_000) // "4 850 000 Kč"   (NBSP between groups)
formatDate(new Date()) // "9. května 2026"
formatDateTime(new Date()) // "9. května 2026 v 14:32"
```

Never inline `Intl.NumberFormat` in components.

## Form validation messages (specific, helpful)

| Bad                      | Good                                          |
| ------------------------ | --------------------------------------------- |
| "Invalid email"          | "E-mail musí obsahovat zavináč (@) a doménu." |
| "Required"               | "Vyplňte prosím Vaše jméno."                  |
| "Phone invalid"          | "Telefon zadejte včetně předvolby, např. +420 777 123 456." |
| "Server error"           | "Něco se pokazilo. Zkuste to prosím znovu nebo nám napište na info@aurahomes.cz." |

## Success states

| Bad                       | Good                                                  |
| ------------------------- | ----------------------------------------------------- |
| "Submitted!"              | "Děkujeme. Ozveme se Vám do dvou pracovních dnů."     |
| "Saved!"                  | "Uloženo."                                            |

## Empty states / placeholders

Avoid placeholders as labels. If a placeholder is needed:

- "např. Jan Novák" (input for name)
- "vy@email.cz" (input for email)
- "+420 777 123 456" (input for phone)
- "Co byste se rádi dozvěděli?" (textarea for message)

## Page metadata

```ts
export const metadata: Metadata = {
  title: "Luma — AURA Homes Experience",
  description:
    "Prozkoumejte model Luma v interaktivní 360° prohlídce. Konfigurujte fasádu, terasu a pergolu, sledujte cenu naživo.",
};
```

## When you write copy

1. Write the Czech version first — don't translate from English.
2. Read it aloud. Does it sound like a Czech designer would speak?
3. If unsure about a phrase, prefer the standardized one above.
4. Diacritics matter: čárky, háčky, ů. Always.
