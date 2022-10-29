import { ChangeEvent, createRef, FocusEvent, KeyboardEvent, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker'
import "./Fields.css"
import "react-datepicker/dist/react-datepicker.min.css";



import { faCalendarDays, IconDefinition, faSquare, faSquareCheck } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const DatePicker = ({id, label}: {id: string, label: string}) => {
  const [startDate, setStartDate] = useState(new Date());
  const [valid, setValid] = useState(false)

  const isDateInTheFuture = (date: Date) => {
    const now = new Date();
    return date > now;
  }

  const onDateChange = (date: any) => {
    if (date === null) return;
    setStartDate(date)
    if (isDateInTheFuture(date)) {
      return setValid(false);
    }
    setValid(true);
  }

  return (
    <div className='pyro-input-container'>
      <label htmlFor={id}>{label}</label>
      <div className='pyro-input-field-container' >
        <div className='pyro-input-element-container'>
          <ReactDatePicker dateFormat="dd/MM/yyyy HH:mm" showTimeSelect timeFormat='HH:mm' selected={startDate} onChange={onDateChange} className={`pyro-input ${valid? "valid": ""} ${valid === false? "invalid": "" }`} id={id}/>
          <FontAwesomeIcon icon={faCalendarDays} className="pyro-input-field-icon"/>
        </div>
      </div>
    </div>
  )
}

type SelectItem = {displayName: string, value: string | number}

export const DropDown = ({
  id,
  label,
  icon,
  multiple = false,
  items = [],
  placeholder = "Select",
  filterPlacehoder = "Filter"
}: {
  id: string,
  label: string,
  icon: IconDefinition,
  multiple?: boolean,
  items: Array<SelectItem>,
  placeholder?: string,
  filterPlacehoder?: string
}) => {
  // Todo: Optimize this hot mess

  let debounceTimer: any;

  const [input, setInput] = useState<string>("")
  const [matchingItems, setMatchingItems] = useState<Array<SelectItem>>(items)
  const [open, setOpen] = useState<boolean>(false)
  const [arrowFocus, setArrowFocus] = useState<number|null>(null);
  const [valid, setValid] = useState<boolean|null>(null)

  const simplifyString = (input: string) => input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    setOpen(true)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    e.preventDefault()
    resetArrowFocus()
    setOpen(false)
  }


  const resetArrowFocus = () => setArrowFocus(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    const isArrowUp = (e.key === "ArrowUp")
    const isArrowDown = (e.key === "ArrowDown")
    const isEnter = (e.key === "Enter")

    if (!(isArrowDown || isArrowUp || isEnter)) return;
    e.preventDefault()
    if (isEnter) {
      resetArrowFocus()
      // checkInputValidity()
      setOpen(false)
    }

    let newArrowFocus = (arrowFocus === null ? -1: arrowFocus)

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

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputText = e.target.value
    resetArrowFocus()
    setInput(inputText)

      setMatchingItems(items.filter((item) => {
        return (simplifyString(item.displayName).includes(simplifyString(inputText)))
      }))
    // checkInputValidity()

  }

  const handleOptionClick = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    resetArrowFocus()

    setInput((e.target as HTMLLIElement).dataset.value as string)
  }

  const checkInputValidity = useCallback(() => {
    if (input.length === 0) {
      setValid(null);
      return;
    }
    setValid(
      items.map(({displayName}) => displayName).includes(input)
    )
  }, [items, input])

  useEffect(() => {checkInputValidity()})

  return (
    <div className="pyro-input-container">
      <label htmlFor={id}>{label}</label>
      <div className='pyro-input-field-container' >
        <div className='pyro-input-element-container'>
          <input name={id} id={id} onInput={handleInput} onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} value={input} className={`pyro-input ${valid? "valid": ""} ${valid === false? "invalid": "" } ${open? 'open': 'closed'}`} placeholder={open? filterPlacehoder: placeholder}/>
          <FontAwesomeIcon icon={icon} className="pyro-input-field-icon"/>
        </div>
        <ul className={`select ${open? 'open': 'closed'}`}>
          {matchingItems.map(({displayName, value}, index) =>
            <li data-value={value} key={value} value={value} onClick={handleOptionClick} className={`select-item ${arrowFocus === index? "arrowFocused": ""} ${multiple? "multiple": ""}`}>{displayName}</li>
          )}
        </ul>
      </div>
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
  placeholder = "Select",
  filterPlacehoder = "Filter",
}: {
  id: string,
  label: string,
  icon: IconDefinition,
  multiple?: boolean,
  items: Array<SelectItem>,
  placeholder?: string,
  filterPlacehoder?: string
}) => {
  // Todo: Optimize this hot mess


  let blurTimer: NodeJS.Timeout;
  const inputRef = createRef<HTMLInputElement>();

  type ItemWithSelection = SelectItem & {selected: boolean}

  const [itemsWithSelection, setItemsWithSelection] = useState<Array<ItemWithSelection>>(items.map(item => ({...item, selected: false})))

  const [input, setInput] = useState<string>("")
  const [open, setOpen] = useState<boolean>(false)
  const [arrowFocus, setArrowFocus] = useState<number|null>(null);
  const [valid, setValid] = useState<boolean|null>(true)

  const [selectionDisplayedAsPills, setSelectionDisplayedAsPills] = useState<Array<ItemWithSelection>>([])

  const pillsRef = createRef<HTMLDivElement>();
  const globalInputRef = createRef<HTMLDivElement>();

  const simplifyString = (input: string) => input.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    clearTimeout(blurTimer)
    e.preventDefault()
    setOpen(true)
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    blurTimer = setTimeout(() => {
      resetArrowFocus()
      setOpen(false)
    }, 250)
  }


  const resetArrowFocus = () => setArrowFocus(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    const isArrowUp = (e.key === "ArrowUp")
    const isArrowDown = (e.key === "ArrowDown")
    const isEnter = (e.key === "Enter")
    const isSpace = (e.key === " ")

    if (!(isArrowDown || isArrowUp || isEnter || isSpace)) {
      resetArrowFocus();
      return;
    }

    if (arrowFocus === null && isSpace) {
      resetArrowFocus();
      return;
    }
    e.preventDefault()
    if (isEnter) {
      resetArrowFocus()
      // checkInputValidity()
      setOpen(false)
      return;
    }
    if (isSpace) {
      selectItem( matchingItems.current[(arrowFocus as number)].displayName )
    }


    let newArrowFocus = (arrowFocus === null ? -1: arrowFocus)
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

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setInput(e.target.value)
    refreshMatchingItems(e.target.value)
  }

  const handleOptionClick = (e: MouseEvent<HTMLLIElement>) => {
    e.preventDefault();
    e.stopPropagation()
    inputRef.current?.focus()

    selectItem((e.target as HTMLLIElement).dataset.value as string);
  }

  const selectItem = (optionText: string) => {
    const newItemsWithSelection = [...itemsWithSelection]; // Workaround to force react to re-trigger render https://stackoverflow.com/a/67354136/6287237
    for (let i = 0; i < newItemsWithSelection.length; i++) {
      if (newItemsWithSelection[i].displayName === optionText) {
        newItemsWithSelection[i].selected = !newItemsWithSelection[i].selected;
      }
    }
    setItemsWithSelection(newItemsWithSelection)
    setSelectionDisplayedAsPills(newItemsWithSelection)
  }

  const matchingItems  = useRef<typeof itemsWithSelection>(itemsWithSelection)

  const refreshMatchingItems = (inputFilter: string) => {
    if (inputFilter === "") {
      matchingItems.current = itemsWithSelection;
    }
    matchingItems.current = itemsWithSelection.filter((item) => {
      return (simplifyString(item.displayName).includes(simplifyString(inputFilter)))
    })
  }

  const onPillClick = (e: MouseEvent<HTMLSpanElement>) => {
    selectItem((e.target as HTMLSpanElement).dataset.value as string)
  }

  const selectedItems = itemsWithSelection.filter(({selected}) => selected)
  const croppedselectedItems = selectionDisplayedAsPills.filter(({selected}) => selected)

  const renderPills = () => {
    const notDisplayedCount = selectedItems.length - croppedselectedItems.length
    return [
      ...croppedselectedItems.map(({displayName, value}, index) => <p className='pill' key={index}>{displayName} <span data-value={value} onClick={onPillClick}>x</span></p>),
      ...(notDisplayedCount > 0? [<p className='pill' key={-1}>{notDisplayedCount} autres</p>] : []  )
    ]
  }

  useLayoutEffect(() => {
    const inputRequiredSizePx = 200;
    if (! globalInputRef.current || ! pillsRef.current) {
      return
    }

    const unPx : (valueWithPx: string) => number = (valueWithPx)  => {
      return Number(valueWithPx.replace("px", ""))
    }

    const getRealSize = (elem: HTMLElement) => {
      const windowElem = window.getComputedStyle(elem)
      return (
        unPx(windowElem.marginLeft)
        + elem.scrollWidth
        + unPx(windowElem.marginRight)
      )
    }
    const maxTarget = globalInputRef.current?.scrollWidth - inputRequiredSizePx;
    if (maxTarget  < pillsRef.current?.scrollWidth) {
      // input is too small ! Group the last pills together
      let currentWidth = 0;
      let pillCount = 0;

      let brokeOut= false
      console.log("=================");
      console.log(selectionDisplayedAsPills)

      for (pillCount ; pillCount < pillsRef.current.childNodes.length; pillCount ++) {
        currentWidth += getRealSize(pillsRef.current.children.item(pillCount) as HTMLElement)
        console.log("item", pillCount);
        console.log("widt", currentWidth);

        if ( currentWidth > maxTarget) {
          brokeOut = true
          break;
        }
      }
      console.log("brokeout", pillCount)
      console.log("end", currentWidth)
      console.log("should be", pillsRef.current?.scrollWidth)
      if (brokeOut) {
        // Only retrigger re-render if the cropping has changed
        setSelectionDisplayedAsPills(selectedItems.slice(0, pillCount - 1))
      }
    }
  }, [globalInputRef, pillsRef, selectionDisplayedAsPills, selectedItems])

  return (
    <div className="pyro-input-container">
      <label htmlFor={id}>{label}</label>
      <div className='pyro-input-field-container' onBlur={handleBlur}>
        <div className='pyro-input-element-container'>
          <div ref={globalInputRef} className={`pyro-input ${valid? "valid": ""} ${valid === false? "invalid": "" } ${open? 'open': 'closed'}`}>
            <div className="pills" ref={pillsRef}>
              {renderPills()}
            </div>
            <input ref={inputRef} name={id} id={id} onKeyDown={handleKeyDown} onInput={handleInput} onFocus={handleFocus}  value={input}  placeholder={open? filterPlacehoder: placeholder}/>
          </div>
          <FontAwesomeIcon icon={icon} className="pyro-input-field-icon"/>
        </div>
        <ul className={`select ${open? 'open': 'closed'}`}>
          {matchingItems.current.map(({displayName, value, selected}, index) =>
            <li data-value={value} key={value} value={value} onClick={handleOptionClick} className={`select-item ${arrowFocus === index? "arrowFocused": ""} ${multiple? "multiple": ""}`}> <FontAwesomeIcon icon={selected? faSquareCheck: faSquare}/>  {displayName}</li>
            )}
        </ul>
      </div>
    </div>
  )
}
