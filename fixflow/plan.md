
# FixFlow — AI-Powered Device Repair Companion

A mobile-first repair guidance app that transforms photos of broken consumer electronics into calm, step-by-step repair instructions. Designed to feel like having a professional technician at your side.

---

## Visual Identity

**Aesthetic Direction**: Calm Technical Manual
- Clean, instructional layouts inspired by professional service manuals
- Monospace technical typography (IBM Plex Mono for technical elements, clean sans-serif for body text)
- Restrained color palette: warm neutral backgrounds, high-contrast text, purposeful accent colors for warnings and actions
- Industrial but approachable—trustworthy without feeling sterile

**Color System**:
- Warm paper-white backgrounds (`#FAFAF8`)
- Deep charcoal text (`#1C1C1C`)
- Tool blue for primary actions and safe zones
- Amber for caution indicators
- Coral for warnings and critical steps

---

## Core User Flow

### 1. Welcome & Device Selection
- Minimal landing screen with clear purpose statement
- Quick device category selection (Phone, Laptop, Tablet, Headphones, Console)
- Optional: Enter device model for smarter predictions

### 2. Guided Photo Capture
- Step-by-step camera guidance with overlay templates
- "Front view" → "Problem area" → "Close-up detail" sequence
- Visual frame guides showing exactly what angle to capture
- Option to upload existing photos instead

### 3. AI Diagnosis Screen
The AI analyzes uploaded images and returns:
- **Damage Detection**: What's broken and why (cracked screen, water damage, loose connector)
- **Difficulty Assessment**: Beginner/Intermediate/Advanced rating with time estimate
- **Failure Prediction**: Common issues for this device model
- Confidence indicator showing diagnosis certainty

### 4. Repair Guide (Vertical Timeline)
A scrollable timeline with the current step expanded:
- **Step cards** with large visuals and concise instructions
- **Annotated hotspots** on user's actual photos showing exactly where to work
- **Semantic highlighting** using color-coded zones (screws in blue, flex cables in yellow)
- **Motion guides** with subtle animations showing rotation direction, pressure points
- **Side-by-side comparison** panel for reference images vs user's device
- Progress indicator showing completion percentage

### 5. Parts List & Tools Required
- Complete parts list with:
  - Part names and specifications
  - Estimated cost ranges
  - Common supplier links (iFixit, Amazon, manufacturer)
- Tools required with icons and substitution suggestions
- Difficulty indicators per part replacement

### 6. Completion & Feedback
- Success confirmation with celebratory but restrained feedback
- Quick rating of guide accuracy
- Option to save repair to device (local storage, no account required)

---

## Key UI Components

**Photo Viewer with Overlays**
- Pinch-to-zoom capability
- Toggle-able annotation layers
- Numbered callout system matching step instructions

**Step Timeline**
- Compact collapsed state showing step title + status
- Expanded state with full instructions, images, and tools
- Smooth scroll-snap behavior on mobile

**Confidence Meter**
- Visual indicator for AI certainty on diagnosis
- Transparency builds trust when AI is uncertain

**Tool/Part Cards**
- Compact cards with icon, name, and essential info
- Expandable for detailed specifications

---

## Technical Implementation

**AI Integration**
- Lovable Cloud with Gemini integration for image analysis
- Edge function to process photos and return structured repair data
- Streaming responses for perceived speed during analysis

**Frontend Stack**
- React components with clean separation of concerns
- CSS custom properties for consistent theming
- Framer Motion or CSS animations for step transitions and highlights
- Mobile-first responsive design

**Data Flow**
- Photos uploaded → Edge function → Gemini analysis → Structured JSON response
- Response maps directly to UI components (diagnosis card, step timeline, parts list)

---

## Mobile-First Considerations

- Touch-friendly targets (minimum 44px)
- Bottom-sheet navigation for tool/parts lists
- Thumb-zone optimized action buttons
- Readable in bright lighting conditions (high contrast)
- Offline-capable step viewing once loaded

---

## What Makes This Different

Unlike generic AI chat interfaces, FixFlow:
- Annotates the user's actual photos, not stock images
- Uses a calm, instructional aesthetic that reduces repair anxiety
- Presents one focused task at a time while maintaining context
- Feels engineered and trustworthy, not experimental or playful
- Guides physical action, not just information delivery

The goal: Users forget they're using AI and feel like they're following a master technician's personal guidance.
