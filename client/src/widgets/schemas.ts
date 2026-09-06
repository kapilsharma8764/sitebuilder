import type { BlockType } from '@/blocks/types'
import type { WidgetSchema } from './field-types'

/**
 * What each widget lets you change, and what those controls are called.
 *
 * Two rules hold across every schema here:
 *
 * 1. Only declare a field the widget actually renders. A control that quietly
 *    does nothing is worse than a missing one — the user changes it, sees no
 *    effect, and stops trusting the whole panel.
 *
 * 2. Label things the way the person using the builder would say them. The
 *    stored key stays whatever the component expects (`subheadline`,
 *    `ctaText`); the label is plain language ("Supporting text", "Button").
 *
 * `variant` is the exception to key handling: it lives on the block rather
 * than inside props, and the panel special-cases it.
 */
export const widgetSchemas: Record<BlockType, WidgetSchema> = {
  navbar: {
    groups: [
      {
        title: 'Content',
        fields: {
          logo: { kind: 'text', label: 'Business name' },
          links: { kind: 'strings', label: 'Menu items', addLabel: 'Add menu item' },
          ctaText: { kind: 'text', label: 'Button', help: 'Leave empty to hide the button.' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'default', label: 'Logo left, menu right' },
              { value: 'centered', label: 'Everything centred' },
            ],
          },
        },
      },
    ],
  },

  hero: {
    groups: [
      {
        title: 'Content',
        fields: {
          badge: { kind: 'text', label: 'Small label above heading', help: 'Optional. Leave empty to hide.' },
          headline: { kind: 'text', label: 'Heading' },
          subheadline: { kind: 'textarea', label: 'Supporting text', rows: 3 },
          primaryCta: { kind: 'text', label: 'Main button' },
          secondaryCta: { kind: 'text', label: 'Second button', help: 'Optional.' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'centered', label: 'Centred' },
              { value: 'split', label: 'Text left, space right' },
              { value: 'gradient', label: 'Colour wash' },
              { value: 'minimal', label: 'Minimal' },
            ],
          },
        },
      },
    ],
  },

  features: {
    groups: [
      {
        title: 'Content',
        fields: {
          label: { kind: 'text', label: 'Small label', help: 'Optional.' },
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'Cards',
        fields: {
          items: {
            kind: 'repeater',
            label: 'Cards',
            addLabel: 'Add card',
            titleKey: 'title',
            fields: {
              icon: { kind: 'text', label: 'Icon name', help: 'A Lucide icon name, e.g. Zap, Shield, Globe.' },
              title: { kind: 'text', label: 'Card heading' },
              description: { kind: 'textarea', label: 'Card text', rows: 2 },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'grid', label: 'Grid of cards' },
              { value: 'list', label: 'Stacked list' },
              { value: 'alternating', label: 'Alternating sides' },
            ],
          },
        },
      },
    ],
  },

  pricing: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'Plans',
        fields: {
          tiers: {
            kind: 'repeater',
            label: 'Plans',
            addLabel: 'Add plan',
            titleKey: 'name',
            fields: {
              name: { kind: 'text', label: 'Plan name' },
              price: { kind: 'text', label: 'Price', placeholder: '₹499' },
              period: { kind: 'text', label: 'Per', placeholder: 'month' },
              description: { kind: 'text', label: 'One-line description' },
              features: { kind: 'strings', label: "What's included", addLabel: 'Add line' },
              cta: { kind: 'text', label: 'Button' },
              featured: { kind: 'switch', label: 'Highlight this plan' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'simple', label: 'Cards side by side' },
              { value: 'comparison', label: 'Comparison table' },
            ],
          },
        },
      },
    ],
  },

  cta: {
    groups: [
      {
        title: 'Content',
        fields: {
          headline: { kind: 'text', label: 'Heading' },
          subheadline: { kind: 'text', label: 'Supporting text' },
          buttonText: { kind: 'text', label: 'Button' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'simple', label: 'Centred' },
              { value: 'split', label: 'Text left, button right' },
            ],
          },
        },
      },
    ],
  },

  footer: {
    groups: [
      {
        title: 'Content',
        fields: {
          logo: { kind: 'text', label: 'Business name' },
          logoImage: { kind: 'image', label: 'Logo image', help: 'Optional. Replaces the text above.' },
          copyright: { kind: 'text', label: 'Copyright line' },
          links: { kind: 'strings', label: 'Links', addLabel: 'Add link' },
        },
      },
      {
        title: 'Columns',
        fields: {
          columns: {
            kind: 'repeater',
            label: 'Link columns',
            help: 'Only used by the multi-column style.',
            addLabel: 'Add column',
            titleKey: 'title',
            fields: {
              title: { kind: 'text', label: 'Column heading' },
              links: { kind: 'strings', label: 'Links', addLabel: 'Add link' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'simple', label: 'Simple' },
              { value: 'multi-column', label: 'Multiple columns' },
              { value: 'minimal', label: 'Minimal' },
            ],
          },
        },
      },
    ],
  },

  testimonials: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'Reviews',
        fields: {
          items: {
            kind: 'repeater',
            label: 'Reviews',
            addLabel: 'Add review',
            titleKey: 'name',
            fields: {
              name: { kind: 'text', label: 'Name' },
              role: { kind: 'text', label: 'Role or company' },
              quote: { kind: 'textarea', label: 'What they said', rows: 3 },
              rating: { kind: 'number', label: 'Stars', min: 1, max: 5, step: 1 },
              avatar: { kind: 'image', label: 'Photo' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'cards', label: 'Cards' },
              { value: 'carousel', label: 'Sliding' },
              { value: 'spotlight', label: 'One at a time' },
            ],
          },
        },
      },
    ],
  },

  stats: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
        },
      },
      {
        title: 'Numbers',
        fields: {
          items: {
            kind: 'repeater',
            label: 'Numbers',
            addLabel: 'Add number',
            titleKey: 'label',
            fields: {
              value: { kind: 'text', label: 'Number', placeholder: '500+' },
              label: { kind: 'text', label: 'What it counts', placeholder: 'Happy customers' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'grid', label: 'Grid' },
              { value: 'bar', label: 'One row' },
              { value: 'counter', label: 'Large numbers' },
            ],
          },
        },
      },
    ],
  },

  faq: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'Questions',
        fields: {
          items: {
            kind: 'repeater',
            label: 'Questions',
            addLabel: 'Add question',
            titleKey: 'question',
            fields: {
              question: { kind: 'text', label: 'Question' },
              answer: { kind: 'textarea', label: 'Answer', rows: 3 },
            },
          },
        },
      },
    ],
  },

  team: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'People',
        fields: {
          members: {
            kind: 'repeater',
            label: 'People',
            addLabel: 'Add person',
            titleKey: 'name',
            fields: {
              name: { kind: 'text', label: 'Name' },
              role: { kind: 'text', label: 'Role' },
              avatar: { kind: 'image', label: 'Photo' },
            },
          },
        },
      },
    ],
  },

  contact: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
    ],
  },

  newsletter: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
          buttonText: { kind: 'text', label: 'Button' },
          socialProof: { kind: 'text', label: 'Reassurance line', help: 'e.g. "Join 2,000 subscribers"' },
        },
      },
    ],
  },

  logocloud: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          logos: { kind: 'strings', label: 'Company names', addLabel: 'Add company' },
        },
      },
    ],
  },

  content: {
    groups: [
      {
        title: 'Content',
        fields: {
          body: {
            kind: 'textarea',
            label: 'Text',
            rows: 12,
            help: 'Supports Markdown: ## for a heading, **bold**, and - for list items.',
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'prose', label: 'Single column' },
              { value: 'columns', label: 'Two columns' },
              { value: 'highlight', label: 'Highlighted box' },
            ],
          },
        },
      },
    ],
  },

  image: {
    groups: [
      {
        title: 'Content',
        fields: {
          src: { kind: 'image', label: 'Photo' },
          alt: { kind: 'text', label: 'Photo description', help: 'Read aloud by screen readers, and shown if the photo fails to load.' },
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
        },
      },
      {
        title: 'Grid photos',
        fields: {
          images: {
            kind: 'repeater',
            label: 'Photos',
            help: 'Only used by the grid style.',
            addLabel: 'Add photo',
            fields: {
              src: { kind: 'image', label: 'Photo' },
              alt: { kind: 'text', label: 'Photo description' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'hero-image', label: 'Full width' },
              { value: 'side-by-side', label: 'Photo beside text' },
              { value: 'grid', label: 'Grid of photos' },
            ],
          },
          imageSide: {
            kind: 'select',
            label: 'Photo goes',
            options: [
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ],
          },
        },
      },
    ],
  },

  video: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          url: { kind: 'text', label: 'Video link', placeholder: 'https://youtube.com/watch?v=…' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Where it is hosted',
            options: [
              { value: 'youtube', label: 'YouTube' },
              { value: 'vimeo', label: 'Vimeo' },
            ],
          },
        },
      },
    ],
  },

  gallery: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          images: {
            kind: 'repeater',
            label: 'Photos',
            addLabel: 'Add photo',
            titleKey: 'caption',
            fields: {
              src: { kind: 'image', label: 'Photo' },
              alt: { kind: 'text', label: 'Photo description' },
              caption: { kind: 'text', label: 'Caption' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'grid', label: 'Even grid' },
              { value: 'masonry', label: 'Staggered' },
            ],
          },
        },
      },
    ],
  },

  map: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          address: {
            kind: 'textarea',
            label: 'Address',
            rows: 3,
            help: 'Shown beside the map, and used to find the location.',
          },
          mapUrl: {
            kind: 'text',
            label: 'Google Maps link',
            placeholder: 'https://maps.google.com/…',
            help: 'Optional. Used only if the address above is empty.',
          },
          timing: { kind: 'text', label: 'Opening hours' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'full', label: 'Map across the width' },
              { value: 'side-by-side', label: 'Address beside the map' },
            ],
          },
          height: { kind: 'number', label: 'Map height', min: 200, max: 700, step: 20, unit: 'px' },
        },
      },
    ],
  },

  whatsapp: {
    groups: [
      {
        title: 'Content',
        fields: {
          number: {
            kind: 'text',
            label: 'WhatsApp number',
            placeholder: '98765 43210',
            help: 'Spaces and dashes are fine. Leave empty to hide the button.',
          },
          countryCode: { kind: 'text', label: 'Country code', placeholder: '91' },
          label: { kind: 'text', label: 'Button text' },
          message: {
            kind: 'textarea',
            label: 'Opening message',
            rows: 2,
            help: 'Filled in for the visitor when the chat opens.',
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'floating', label: 'Floats in the corner' },
              { value: 'inline', label: 'Sits in the page' },
            ],
          },
          side: {
            kind: 'select',
            label: 'Corner',
            options: [
              { value: 'right', label: 'Bottom right' },
              { value: 'left', label: 'Bottom left' },
            ],
          },
        },
      },
    ],
  },

  chart: {
    groups: [
      {
        title: 'Content',
        fields: {
          title: { kind: 'text', label: 'Heading' },
          subtitle: { kind: 'text', label: 'Supporting text' },
          items: {
            kind: 'repeater',
            label: 'Numbers',
            addLabel: 'Add a number',
            titleKey: 'label',
            fields: {
              label: { kind: 'text', label: 'What it is', placeholder: 'Repeat customers' },
              value: {
                kind: 'text',
                label: 'Number',
                placeholder: '62%',
                help: 'Write it however you say it — 62%, 1,200 or ₹4.5L all work.',
              },
              color: { kind: 'color', label: 'Bar colour' },
            },
          },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'bars', label: 'Bars across' },
              { value: 'columns', label: 'Columns standing up' },
              { value: 'donut', label: 'Donut with a key' },
            ],
          },
        },
      },
    ],
  },

  divider: {
    groups: [
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'line', label: 'Line' },
              { value: 'space', label: 'Empty space' },
              { value: 'dots', label: 'Dots' },
            ],
          },
          width: {
            kind: 'select',
            label: 'Width',
            options: [
              { value: 'full', label: 'Full width' },
              { value: 'centered', label: 'Centred' },
              { value: 'narrow', label: 'Narrow' },
            ],
          },
          height: { kind: 'number', label: 'Height', min: 0, max: 400, step: 4, unit: 'px' },
        },
      },
    ],
  },

  banner: {
    groups: [
      {
        title: 'Content',
        fields: {
          text: { kind: 'text', label: 'Message' },
          linkText: { kind: 'text', label: 'Link text', help: 'Optional. Leave empty to hide the link.' },
          linkUrl: { kind: 'text', label: 'Link address', placeholder: 'https://…' },
        },
      },
      {
        title: 'Layout',
        fields: {
          variant: {
            kind: 'select',
            label: 'Style',
            options: [
              { value: 'ribbon', label: 'Ribbon' },
              { value: 'bar', label: 'Full-width bar' },
            ],
          },
        },
      },
    ],
  },
}
