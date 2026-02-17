# Hybrid Animation System Design

## Overview
Implement a hybrid animation system combining global page transitions with configurable scroll-triggered animations for individual sections.

## Architecture

### 1. Global Page Transitions
*   **Location**: `app/(site)/template.tsx`
*   **Mechanism**: Uses `framer-motion`'s `motion.div` to animate `opacity` and `y` position on mount.
*   **Behavior**:
    *   Initial: `opacity: 0`, `y: 20`
    *   Animate: `opacity: 1`, `y: 0`
    *   Transition: `easeOut`, `duration: 0.5s`

### 2. Configurable Section Animations
*   **Location**: `components/ui/Section.tsx`
*   **Props**: Add `animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'none'`
*   **Mechanism**:
    *   Wrap content in `motion.div`.
    *   Use `initial` (hidden state) and `whileInView` (visible state).
    *   `viewport={{ once: true, margin: "-100px" }}` to trigger when slightly inside viewport.

### 3. Editor Integration
*   **Location**: `app/admin/editor/page.tsx`
*   **Changes**:
    *   Update `Section` config in Puck.
    *   Add `animation` field (Radio or Select).
    *   Options: "None", "Fade Up", "Fade In", "Slide Left", "Slide Right".

## Data Flow
1.  Editor saves `animation` string in Puck data.
2.  `PuckRenderer` passes data to `Section` component.
3.  `Section` component selects variant based on string.
4.  `framer-motion` handles the DOM manipulation.

## Testing Strategy
1.  **Manual**:
    *   Verify page load transition (soft fade).
    *   Verify scroll triggers (elements pop in).
    *   Verify editor preview (animations should work or be disabled in edit mode to prevent annoyance).
