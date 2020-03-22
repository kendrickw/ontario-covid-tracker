import {
  Button,
  FormGroup,
  IconName,
  IFormGroupProps,
  MenuItem,
} from '@blueprintjs/core';
import {
  ISelectProps,
  ItemPredicate,
  ItemRenderer,
  Select as BpSelect,
} from '@blueprintjs/select';
import React from 'react';

export interface SelectItemT {
  id: string; // unique ID for selector
  full: string; // full name to be displayed in dropdown
  abbr?: string; // [optional] abbreviation to be displayed in dropdown
}

export class SelectItems {
  items: SelectItemT[];
  constructor(items: SelectItemT[]) {
    this.items = items;
  }

  /**
   * Find an item using the unique ID
   *
   * @param entryId an item ID
   */
  find = (entryId?: any) => {
    return this.items.find(({ id }) => id === entryId);
  };
}

function highlightText(text: string, query: string) {
  let lastIndex = 0;
  const words = query
    .split(/\s+/)
    .filter((word) => word.length > 0)
    .map(escapeRegExpChars);
  if (words.length === 0) {
    return [text];
  }
  const regexp = new RegExp(words.join('|'), 'gi');
  const tokens: React.ReactNode[] = [];
  while (true) {
    const match = regexp.exec(text);
    if (!match) {
      break;
    }
    const length = match[0].length;
    const before = text.slice(lastIndex, regexp.lastIndex - length);
    if (before.length > 0) {
      tokens.push(before);
    }
    lastIndex = regexp.lastIndex;
    tokens.push(<strong key={lastIndex}>{match[0]}</strong>);
  }
  const rest = text.slice(lastIndex);
  if (rest.length > 0) {
    tokens.push(rest);
  }
  return tokens;
}

function escapeRegExpChars(text: string) {
  return text.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}

const itemPredicate: ItemPredicate<SelectItemT> = (
  query,
  entry,
  index,
  exactMatch
) => {
  const normalizedLabel = entry.full.toLowerCase();
  const normalizedQuery = query.toLowerCase();

  if (exactMatch) {
    return normalizedLabel === normalizedQuery;
  } else {
    return normalizedLabel.indexOf(normalizedQuery) >= 0;
  }
};

const itemRenderer: ItemRenderer<SelectItemT> = (
  entry,
  { handleClick, modifiers, query }
) => {
  if (!modifiers.matchesPredicate) {
    return null;
  }

  return (
    <MenuItem
      active={modifiers.active}
      disabled={modifiers.disabled}
      key={entry.id}
      // label on the right side of menu item
      labelElement={entry.abbr && <span>{entry.abbr}</span>}
      text={highlightText(entry.full, query)}
      onClick={handleClick}
    />
  );
};

const BlueprintSelect = BpSelect.ofType<SelectItemT>();
type SelectProps = Omit<ISelectProps<SelectItemT>, 'itemRenderer'>;

interface Props extends IFormGroupProps, SelectProps {
  value: React.ReactNode; // Text to be display on selection button
  valueIcon?: IconName; // Icon to appear on the left side of selection button
  isRequired?: boolean; // Selecting first item in itemlist will trigger the isRequired condition
}

const Select = ({
  className,
  intent,
  helperText,
  inline,
  labelFor,
  labelInfo,
  label,
  items,
  value,
  valueIcon,
  activeItem,
  isRequired,
  disabled = false,
  ...otherProps
}: Props) => {
  const valid = isRequired ? activeItem && activeItem !== items[0] : true;
  const customIntent = valid ? intent : 'danger';

  return (
    <FormGroup
      className={className}
      intent={customIntent}
      helperText={valid ? helperText : 'Must select a value'}
      inline={inline}
      label={label}
      labelFor={labelFor}
      labelInfo={labelInfo}
    >
      <BlueprintSelect
        items={items}
        itemPredicate={itemPredicate}
        activeItem={activeItem}
        itemRenderer={itemRenderer}
        disabled={disabled}
        {...otherProps}
      >
        <Button
          id={labelFor}
          intent={customIntent}
          disabled={disabled}
          text={value}
          icon={valueIcon}
          rightIcon="caret-down"
        />
      </BlueprintSelect>
    </FormGroup>
  );
};

export default Select;
