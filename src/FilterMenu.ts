export class FilterMenu {

  th:                 HTMLElement;
  tds:                Array<HTMLElement>;
  menuItems:          Array<MenuItem>;
  column:             number;
  menu:               HTMLElement;
  inputs:             Array<Element>;
  selectAllCheckbox:  Element;
  searchFilter:       Element;

  constructor (th: HTMLElement, col: number) {
    this.th = th;
    this.column = col;
    this.tds = $('table tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
  }

  public initialize(): void {
    this.menuItems = this.retrieveMenuItems();
    this.menu = this.dropdownFilterDropdown();
    this.th.appendChild(this.menu);

    // variables for click handlers
    let $trigger = $(this.menu.children[0]);
    let $content = $(this.menu.children[1]);
    let $menu = $(this.menu);

    // toggle hide/show when the trigger is clicked
    $trigger.click(() => $content.toggle());

    $(document).click(function(el) {
      // hide the content if the user clicks outside of the menu
      if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
        $content.hide();
      } 
    });
  }

  public isSelected(value: string): boolean {
    return this.menuItems.filter(function(item: MenuItem) {
      return item.selected;
    }).map(function(item: MenuItem) {
      return item.value;
    }).indexOf(value) > -1;
  }

  public searchToggle(value: string): void {
    if (value.length > 0) {
      // deselect All
      this.toggleAll(false, false);
      if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;

      this.menuItems.filter(function(item) {
        return item.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
      }).forEach(function(item) {
        item.selected = true;
      });

      this.inputs.filter(function(input: HTMLInputElement) {
        return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
      }).forEach(function(input: HTMLInputElement) {
        input.checked = true;
      });

    } else {
      this.toggleAll(true, false);
      if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
    }
  }


  public toggle(value: string): void {
    // delselect inventory
    this.menuItems.filter(function(item: MenuItem) {
      return item.value === value;
    }).forEach(function(item: MenuItem) {
      item.selected = !item.selected;
    });

    let totalItems = this.menuItems.length;
    let selectedItems = this.menuItems.filter(function(item: MenuItem) {
      return item.selected;
    }).length;

    if (this.selectAllCheckbox instanceof HTMLInputElement) {
      this.selectAllCheckbox.checked = (totalItems === selectedItems);
    }
  }

  public selectAllToggle(value: boolean): void {
    this.toggleAll(value, true);
  }

  private toggleAll(value: boolean, clearSearch: boolean): void {
    if (clearSearch) $(this.searchFilter).val('');
    // delselect inventory
    this.menuItems.forEach(function(item: MenuItem) {
      item.selected = value;
    });
    this.inputs.forEach(function(input: HTMLInputElement) {
      input.checked = value;
    });
  }

  private retrieveMenuItems(): Array<MenuItem> {
    let inputs = this.inputs;
    let column = this.column;
    return this.tds.map(function(el: HTMLElement, row: number) {
      return {
        column: column,
        row: row,
        value: el.innerHTML,
        selected: true
      };
    });
  }
  
  private dropdownFilterItem(td: HTMLElement): HTMLElement {
    // build holder div
    let value = td.innerText;
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-item';
    // build input
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.value = value;
    input.setAttribute('checked','checked');
    input.className = 'dropdown-filter-menu-item item';
    // get index of td element
    input.setAttribute('data-column', $(td).parent().children().index($(td)).toString());
    // append input to holding div
    dropdownFilterItem.appendChild(input);
    dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML + ' ' +  value;
    return dropdownFilterItem;
  }

  private dropdownFilterItemSelectAll(): HTMLElement {
    // build holder div
    let value = 'Select All';
    let dropdownFilterItemSelectAll = document.createElement('div');
    dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
    // build input
    let input = document.createElement('input');
    input.type = 'checkbox';
    input.value = 'Select All';
    input.setAttribute('checked','checked');
    input.className = 'dropdown-filter-menu-item select-all';
    input.setAttribute('data-column', this.column.toString());
    // append input to holding div
    dropdownFilterItemSelectAll.appendChild(input);
    dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' +  value;
    return dropdownFilterItemSelectAll;
  }
  
  private dropdownFilterSearch(): HTMLElement {
    // build holder div
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-search';
    // build input
    let input = document.createElement('input');
    input.type = 'text';
    input.className = 'dropdown-filter-menu-search form-control';
    input.setAttribute('data-column', this.column.toString());
    input.setAttribute('placeholder', 'search');
    // append input to holding div
    dropdownFilterItem.appendChild(input);
    return dropdownFilterItem;
  }

  private dropdownFilterSort(direction: string): HTMLElement {
    // build holder div
    let dropdownFilterItem = document.createElement('div');
    dropdownFilterItem.className = 'dropdown-filter-sort';
    // build span
    let span = document.createElement('span');
    span.className = direction.toLowerCase().split(' ').join('-');
    span.setAttribute('data-column', this.column.toString());
    span.innerText = direction;
    // append input to holding div
    dropdownFilterItem.appendChild(span);
    return dropdownFilterItem;
  }

  private dropdownFilterContent(): HTMLElement {
    // build holder div
    let dropdownFilterContent = document.createElement('div');
    dropdownFilterContent.className = 'dropdown-filter-content';

    let innerDivs = this.tds.reduce(function(arr, el) {
      let values = arr.map((el) => el.innerText);
      if (values.indexOf(el.innerText) < 0) arr.push(el);
      return arr;
    }, [])
    .sort(function(a, b) {
      return a.innerText.toLowerCase() > b.innerText.toLowerCase() ? 1 : -1;
    })
    .map(this.dropdownFilterItem)

    // map inputs to instance
    this.inputs = innerDivs.map((div) => div.firstElementChild);

    // add select all checkbox
    let selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
    this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
    innerDivs.unshift(selectAllCheckboxDiv);

    let searchFilterDiv = this.dropdownFilterSearch();
    this.searchFilter = searchFilterDiv.firstElementChild;

    // create outer div
    let outerDiv = innerDivs.reduce(function(outerDiv, innerDiv) {
      outerDiv.appendChild(innerDiv);
      return outerDiv;
    }, document.createElement('div'));
    outerDiv.className = 'checkbox-container';

    return [ this.dropdownFilterSort( 'A to Z'), 
             this.dropdownFilterSort( 'Z to A'),
             searchFilterDiv
      ]
      .concat(outerDiv)
      .reduce(function(html, el) {
        html.appendChild(el);
        return html;
    }, dropdownFilterContent);
  }

  private dropdownFilterDropdown(): HTMLElement {
    // build holder div
    let dropdownFilterDropdown = document.createElement('div');
    dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
    let arrow = document.createElement('span');
    arrow.className = 'glyphicon glyphicon-arrow-down dropdown-filter-icon';
    let icon = document.createElement('i');
    icon.className = 'arrow-down';
    arrow.appendChild(icon);
    dropdownFilterDropdown.appendChild(arrow);
    dropdownFilterDropdown.appendChild(this.dropdownFilterContent());
    return dropdownFilterDropdown;
  }

}
