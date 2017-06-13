import { FilterMenu } from './FilterMenu'

export class FilterCollection {

  filterMenus: Array<FilterMenu>;
  rows: Array<HTMLElement>;
  target: HTMLElement;

  constructor (target: JQuery) {
    this.filterMenus = target.find('th').toArray().map(function(th: HTMLElement, idx: number) {
      return new FilterMenu(th, idx);
    });
    this.rows = target.find('tbody').find('tr').toArray();
    this.target = target[0];
  }

  public initialize(): void {
    this.filterMenus.forEach(function(filterMenu) {
      filterMenu.initialize();
    });
    this.bindCheckboxes();
    this.bindSelectAllCheckboxes();
    this.bindSort();
    this.bindSearch();
  }

  private bindCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let updateRowVisibility = this.updateRowVisibility;
    $('.dropdown-filter-menu-item.item').change(function() {
      let column = $(this).data('column');
      let value = $(this).val();
      filterMenus[column].toggle(value);
      updateRowVisibility(filterMenus, rows);
    });
  }

  private bindSelectAllCheckboxes(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let updateRowVisibility = this.updateRowVisibility;
    $('.dropdown-filter-menu-item.select-all').change(function() {
      let column = $(this).data('column');
      let value = this.checked;
      filterMenus[column].selectAllToggle(value);
      updateRowVisibility(filterMenus, rows);
    });
  }
  
  private bindSort(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let sort = this.sort;
    let table = this.target;
    let updateRowVisibility = this.updateRowVisibility;
    $('.dropdown-filter-sort').click(function() {
      let $sortElement = $(this).find('span');
      let column = $sortElement.data('column');
      let order = $sortElement.attr('class');
      sort(column, order, table);
      updateRowVisibility(filterMenus, rows);
    });
  }

  private bindSearch(): void {
    let filterMenus = this.filterMenus;
    let rows = this.rows;
    let sort = this.sort;
    let table = this.target;
    let updateRowVisibility = this.updateRowVisibility;
    $('.dropdown-filter-search').keyup(function() {
      let $input = $(this).find('input');
      let column = $input.data('column');
      let value = $input.val();
      filterMenus[column].searchToggle(value);
      updateRowVisibility(filterMenus, rows);
    });
  }

  private updateRowVisibility(filterMenus: Array<FilterMenu>, rows: Array<HTMLElement>): void {
    rows.forEach(function(row) {
      let $row = $(row)
      let visible = $row.find('td').toArray().map(function(el, column) {
        return filterMenus[column].isSelected(el.innerText);
      }).reduce(function(prevSelected, nextSelected) {
        return prevSelected && nextSelected;
      }, true);
      visible ? $row.show() : $row.hide();
    });
  }

  private sort(column: number, order: string, table: HTMLElement): void {
    var rows, switching, i, x, y, shouldSwitch;
    switching = true;
    while (switching) {
      switching = false;
      rows = table.getElementsByTagName("tr");
      for (i = 1; i < (rows.length - 1); i++) {
        shouldSwitch = false;
        x = rows[i].getElementsByTagName("td")[column];
        y = rows[i + 1].getElementsByTagName("td")[column];
        if (order === 'a-to-z') {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            shouldSwitch= true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }

}
