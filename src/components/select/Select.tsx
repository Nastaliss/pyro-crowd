import { ChangeEvent, createRef, FocusEvent, KeyboardEvent, MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.min.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { simplifyString } from '../../helpers/strings'
import { faCircleXmark, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'

export type Value = string | number
interface SelectItem { displayName: string, value: Value }

export const DropDown = ({
  id,
  label,
  icon,
  multiple = false,
  items = [],
  placeholder = 'Select',
  filterPlacehoder = 'Filter',
  onChange,
  initialValue = null
}: {
  id: string
  label: string
  icon: IconDefinition
  multiple?: boolean
  items: SelectItem[]
  placeholder?: string
  filterPlacehoder?: string
  onChange: (value: Value | null) => void
  initialValue?: string | null
}): JSX.Element => {
  // Todo: Optimize this hot mess

  const [input, setInput] = useState<string>('')
  const [confirmedInput, setConfirmedInput] = useState<string>(input)
  const [matchingItems, setMatchingItems] = useState<SelectItem[]>(items)
  const [open, setOpen] = useState<boolean>(false)
  const [arrowFocus, setArrowFocus] = useState<number | null>(null)
  const [valid, setValid] = useState<boolean | null>(null)

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    e.preventDefault()
    setOpen(true)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    e.preventDefault()
    resetArrowFocus()
    setOpen(false)
    setConfirmedInput(input)
  }

  const resetArrowFocus = (): void => setArrowFocus(null)

  const handleKeyDown = (e: KeyboardEvent): void => {
    const isArrowUp = (e.key === 'ArrowUp')
    const isArrowDown = (e.key === 'ArrowDown')
    const isEnter = (e.key === 'Enter')

    if (!(isArrowDown || isArrowUp || isEnter)) return
    e.preventDefault()
    if (isEnter) {
      resetArrowFocus()
      setOpen(false)
      setConfirmedInput(input)
      return
    }

    let newArrowFocus = (arrowFocus === null ? -1 : arrowFocus)

    if (isArrowUp) {
      newArrowFocus--
      if (newArrowFocus < 0) newArrowFocus = matchingItems.length - 1
    }
    if (isArrowDown) {
      newArrowFocus++
      if (newArrowFocus >= matchingItems.length) newArrowFocus = 0
    }
    setInput(matchingItems[newArrowFocus].displayName)
    setArrowFocus(newArrowFocus)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    updateInput(e.target.value)
  }

  const updateInput = (inputText: string): void => {
    resetArrowFocus()
    setInput(inputText)

    setMatchingItems(items.filter((item) => {
      return (simplifyString(item.displayName).includes(simplifyString(inputText)))
    }))
  }

  const handleOptionClick = (e: MouseEvent<HTMLLIElement>): void => {
    e.preventDefault()
    resetArrowFocus()

    const clickedInput = (e.target as HTMLLIElement).dataset.value as string
    setInput(clickedInput)
    setConfirmedInput(clickedInput)
  }

  const checkInputValidity = (): void => {
    if (confirmedInput.length === 0) {
      setValid(null)
      return
    }
    for (const item of items) {
      if (item.displayName === confirmedInput) {
        setValid(true)
        onChange(item.value)
        break
      }
      setValid(false)
      onChange(null)
    }
  }

  useEffect(() => checkInputValidity(), [confirmedInput])

  useEffect(() => {
    if (initialValue !== null) setInput(initialValue)
  }, [])

  const clearInput = (e: MouseEvent<SVGSVGElement>): void => { e.preventDefault(); setInput('') }

  return (
    <div className="field-container">
      <label htmlFor={id}>{label}</label>
      <div className='input-container' onFocus={handleFocus} onBlur={handleBlur}>
        <input name={id} id={id} onInput={handleInput} onKeyDown={handleKeyDown} value={input} className={`input ${(valid ?? false) ? 'valid' : ''} ${valid === false ? 'invalid' : ''} ${open ? 'open' : 'closed'}`} placeholder={open ? filterPlacehoder : placeholder}/>
        {open
          ? <FontAwesomeIcon icon={faCircleXmark} className="input-icon clear-icon" onMouseDown={clearInput}/>
          : <FontAwesomeIcon icon={icon } className="input-icon"/>
        }
      </div>
      <ul className={`select ${open ? 'open' : 'closed'}`}>
        {matchingItems.map(({ displayName, value }, index) =>
          <li data-value={value} key={value} value={value} onClick={handleOptionClick} className={`select-item ${arrowFocus === index ? 'arrowFocused' : ''} ${multiple ? 'multiple' : ''}`}>{displayName}</li>
        )}
      </ul>
    </div>
  )
}

// Todo: Merge with classic DropDown
export const MultipleDropDown = ({
  id,
  label,
  icon,
  multiple = false,
  items = [],
  placeholder = 'Select',
  filterPlacehoder = 'Filter'
}: {
  id: string
  label: string
  icon: IconDefinition
  multiple?: boolean
  items: SelectItem[]
  placeholder?: string
  filterPlacehoder?: string
}): JSX.Element => {
  // Todo: Optimize this hot mess

  let blurTimer: NodeJS.Timeout
  const inputRef = createRef<HTMLInputElement>()

  type ItemWithSelection = SelectItem & { selected: boolean }

  const [itemsWithSelection, setItemsWithSelection] = useState<ItemWithSelection[]>(items.map(item => ({ ...item, selected: false })))

  const [input, setInput] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const [arrowFocus, setArrowFocus] = useState<number | null>(null)
  const [valid] = useState<boolean | null>(true)

  const [selectionDisplayedAsPills, setSelectionDisplayedAsPills] = useState<ItemWithSelection[]>([])

  const pillsRef = createRef<HTMLDivElement>()
  const globalInputRef = createRef<HTMLDivElement>()

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    clearTimeout(blurTimer)
    e.preventDefault()
    setOpen(true)
  }

  const handleBlur = (_e: FocusEvent<HTMLInputElement>): void => {
    blurTimer = setTimeout(() => {
      resetArrowFocus()
      setOpen(false)
    }, 250)
  }

  const resetArrowFocus = (): void => setArrowFocus(null)

  const handleKeyDown = (e: KeyboardEvent): void => {
    const isArrowUp = (e.key === 'ArrowUp')
    const isArrowDown = (e.key === 'ArrowDown')
    const isEnter = (e.key === 'Enter')
    const isSpace = (e.key === ' ')

    if (!(isArrowDown || isArrowUp || isEnter || isSpace)) {
      resetArrowFocus()
      return
    }

    if (arrowFocus === null && isSpace) {
      resetArrowFocus()
      return
    }
    e.preventDefault()
    if (isEnter) {
      resetArrowFocus()
      setOpen(false)
      return
    }
    if (isSpace) {
      selectItem(matchingItems.current[(arrowFocus as number)].displayName)
    }

    let newArrowFocus = (arrowFocus === null ? -1 : arrowFocus)
    if (isArrowUp) {
      newArrowFocus--
      if (newArrowFocus < 0) newArrowFocus = matchingItems.current.length - 1
    }
    if (isArrowDown) {
      newArrowFocus++
      if (newArrowFocus >= matchingItems.current.length) newArrowFocus = 0
    }
    setInput(matchingItems.current[newArrowFocus].displayName)
    setArrowFocus(newArrowFocus)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()

    setInput(e.target.value)
    refreshMatchingItems(e.target.value)
  }

  const handleOptionClick = (e: MouseEvent<HTMLLIElement>): void => {
    e.preventDefault()
    e.stopPropagation()
    inputRef.current?.focus()

    selectItem((e.target as HTMLLIElement).dataset.value as string)
  }

  const selectItem = (optionText: string): void => {
    const newItemsWithSelection = [...itemsWithSelection] // Workaround to force react to re-trigger render https://stackoverflow.com/a/67354136/6287237
    for (let i = 0; i < newItemsWithSelection.length; i++) {
      if (newItemsWithSelection[i].displayName === optionText) {
        newItemsWithSelection[i].selected = !newItemsWithSelection[i].selected
      }
    }
    setItemsWithSelection(newItemsWithSelection)
    setSelectionDisplayedAsPills(newItemsWithSelection)
  }

  const matchingItems = useRef<typeof itemsWithSelection>(itemsWithSelection)

  const refreshMatchingItems = (inputFilter: string): void => {
    if (inputFilter === '') {
      matchingItems.current = itemsWithSelection
    }
    matchingItems.current = itemsWithSelection.filter((item) => {
      return (simplifyString(item.displayName).includes(simplifyString(inputFilter)))
    })
  }

  const onPillClick = (e: MouseEvent<HTMLSpanElement>): void => {
    selectItem((e.target as HTMLSpanElement).dataset.value as string)
  }

  const selectedItems = itemsWithSelection.filter(({ selected }) => selected)
  const croppedselectedItems = selectionDisplayedAsPills.filter(({ selected }) => selected)

  const renderPills = (): JSX.Element[] => {
    const notDisplayedCount = selectedItems.length - croppedselectedItems.length
    const extraText = (extraCount: number): string => (croppedselectedItems.length > 0) ? `${extraCount} autres` : `${extraCount} choix`
    return [
      ...croppedselectedItems.map(({ displayName, value }, index) => <p className='pill' key={index}>{displayName} <span data-value={value} onClick={onPillClick}>x</span></p>),
      ...(notDisplayedCount > 0 ? [<p className='pill overflow' key={-1}>{extraText(notDisplayedCount)}</p>] : [])
    ]
  }

  useLayoutEffect(() => {
    const inputRequiredSizePx = 200
    if ((globalInputRef.current == null) || (pillsRef.current == null)) {
      return
    }

    const unPx: (valueWithPx: string) => number = (valueWithPx) => {
      return Number(valueWithPx.replace('px', ''))
    }

    const getRealSize = (elem: HTMLElement): number => {
      const windowElem = window.getComputedStyle(elem)
      return (
        unPx(windowElem.marginLeft) +
        elem.scrollWidth +
        unPx(windowElem.marginRight)
      )
    }

    const maxTarget = globalInputRef.current?.scrollWidth - inputRequiredSizePx
    if (maxTarget < pillsRef.current?.scrollWidth) {
      // input is too small ! Group the last pills together
      let currentWidth = 0
      let pillCount = 0

      let brokeOut = false
      for (pillCount; pillCount < pillsRef.current.childNodes.length; pillCount++) {
        currentWidth += getRealSize(pillsRef.current.children.item(pillCount) as HTMLElement)

        if (currentWidth > maxTarget) {
          brokeOut = true
          break
        }
      }
      if (brokeOut) {
        // Only retrigger re-render if the cropping has changed
        if (pillCount === 0 && selectionDisplayedAsPills.length === 0) { return }

        setSelectionDisplayedAsPills(selectedItems.slice(0, Math.max(0, pillCount - 1)))
      }
    }
  }, [globalInputRef, pillsRef, selectionDisplayedAsPills, selectedItems])

  return (
    <div className="field-container">
      <label htmlFor={id}>{label}</label>
      <div className='input-container' onBlur={handleBlur}>
        <div ref={globalInputRef} className={`input multiple-select ${(valid ?? false) ? 'valid' : ''} ${valid === false ? 'invalid' : ''} ${open ? 'open' : 'closed'}`}>
          <div className="pills" ref={pillsRef}>
            {renderPills()}
          </div>
          <input ref={inputRef} name={id} id={id} onKeyDown={handleKeyDown} onInput={handleInput} onFocus={handleFocus} value={input} placeholder={open ? filterPlacehoder : placeholder}/>
        </div>
        <FontAwesomeIcon icon={icon} className="input-icon"/>
      </div>
      <ul className={`select ${open ? 'open' : 'closed'}`}>
        {matchingItems.current.map(({ displayName, value, selected }, index) =>
          <li data-value={value} key={value} value={value} onClick={handleOptionClick} className={`select-item ${arrowFocus === index ? 'arrowFocused' : ''} ${multiple ? 'multiple' : ''}`}> <FontAwesomeIcon icon={selected ? faSquareCheck : faSquare}/>  {displayName}</li>
        )}
      </ul>
    </div>
  )
}
