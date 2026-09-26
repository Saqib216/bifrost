"use client"

import * as React from "react"
import { cn } from "cn"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type DropdownProps,
  type Locale,
} from "react-day-picker"

import { Button, buttonVariants } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "dropdown",
  buttonVariant = "ghost",
  startMonth,
  endMonth,
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()
  const currentYear = new Date().getFullYear()
  const defaultStartMonth = startMonth ?? new Date(currentYear - 10, 0)
  const defaultEndMonth = endMonth ?? new Date(currentYear + 10, 11)

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      startMonth={defaultStartMonth}
      endMonth={defaultEndMonth}
      className={cn(
        "group/calendar bg-card text-primary p-2 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(7)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale?.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute z-20 inset-x-0 top-0 flex w-full items-center justify-between gap-1 pointer-events-none",
          defaultClassNames.nav
        ),
        button_previous: cn(
          "size-7 p-0 flex items-center justify-center rounded-md border border-border text-secondary hover:text-primary hover:bg-surface hover:border-muted transition-colors select-none aria-disabled:opacity-30 cursor-pointer pointer-events-auto",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          "size-7 p-0 flex items-center justify-center rounded-md border border-border text-secondary hover:text-primary hover:bg-surface hover:border-muted transition-colors select-none aria-disabled:opacity-30 cursor-pointer pointer-events-auto",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-7 w-full items-center justify-center font-medium text-sm text-primary px-8 relative z-10 pointer-events-auto",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-7 items-center justify-center gap-1.5 text-sm font-medium relative z-10 pointer-events-auto",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-md hover:bg-surface border border-transparent hover:border-border transition-colors cursor-pointer",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10 [color-scheme:dark]",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "flex items-center gap-1 text-sm font-medium text-primary select-none px-1.5 py-0.5 rounded-md [&>svg]:size-3.5 [&>svg]:text-muted",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex justify-between mb-1", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 text-center text-xs font-medium text-muted select-none py-1",
          defaultClassNames.weekday
        ),
        week: cn("mt-1 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-[0.8rem] text-muted-foreground select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-r-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-l-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-l-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-l-(--cell-radius) bg-accent/20",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none bg-accent/10", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-r-(--cell-radius) bg-accent/20",
          defaultClassNames.range_end
        ),
        today: cn(
          "rounded-(--cell-radius) border border-accent/50 text-accent font-semibold",
          defaultClassNames.today
        ),
        outside: cn(
          "text-muted/30 aria-selected:text-muted/30 pointer-events-none",
          defaultClassNames.outside
        ),
        disabled: cn(
          "text-muted/30 opacity-50 pointer-events-none",
          defaultClassNames.disabled
        ),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (
              <ChevronLeftIcon className={cn("size-4", className)} {...props} />
            )
          }

          if (orientation === "right") {
            return (
              <ChevronRightIcon className={cn("size-4", className)} {...props} />
            )
          }

          return (
            <ChevronDownIcon className={cn("size-4", className)} {...props} />
          )
        },
        DayButton: ({ ...props }) => (
          <CalendarDayButton locale={locale} {...props} />
        ),
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-(--cell-size) items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        Dropdown: ({ ...props }) => <CalendarDropdown {...props} />,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDropdown({
  options,
  value,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: DropdownProps) {
  const currentValue = value !== undefined ? String(value) : undefined
  const selectedOption = options?.find((opt) => String(opt.value) === currentValue)

  return (
    <Select
      value={currentValue}
      onValueChange={(val) => {
        if (val !== null && val !== undefined) {
          const syntheticEvent = {
            target: { value: val },
          } as React.ChangeEvent<HTMLSelectElement>
          onChange?.(syntheticEvent)
        }
      }}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        aria-label={ariaLabel}
        className="h-7 w-auto min-w-[70px] justify-between gap-1 border border-border/70 bg-surface/50 px-2 py-0.5 text-xs font-medium text-primary hover:border-muted hover:bg-surface hover:text-primary focus:border-accent focus:ring-2 focus:ring-accent/30 data-[popup-open]:border-accent data-[popup-open]:ring-2 data-[popup-open]:ring-accent/30 cursor-pointer"
      >
        <span>{selectedOption?.label ?? ""}</span>
      </SelectTrigger>
      <SelectContent className="max-h-56 min-w-[90px] p-1">
        {options?.map((option) => (
          <SelectItem
            key={option.value}
            value={String(option.value)}
            disabled={option.disabled}
            className="py-1 px-2 text-xs"
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-8 w-full min-w-(--cell-size) items-center justify-center rounded-md border-0 text-sm font-normal text-secondary transition-all hover:bg-surface hover:text-primary focus:outline-none focus:ring-2 focus:ring-accent/40 data-[range-end=true]:bg-accent data-[range-end=true]:text-white data-[range-start=true]:bg-accent data-[range-start=true]:text-white data-[selected-single=true]:bg-accent! data-[selected-single=true]:text-white! data-[selected-single=true]:font-medium data-[selected-single=true]:shadow-sm cursor-pointer",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
