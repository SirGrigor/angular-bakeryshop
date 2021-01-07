import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {EmployeeService} from './employee.service';
import {Employee} from './employee';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];
  form: FormGroup;

  constructor(private employeeService: EmployeeService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(response => {
      response.data.forEach(employee => {
        this.employees.push(
          new Employee(
            employee.id,
            employee.first_name + ' ' + employee.last_name,
            employee.email,
            employee.avatar
          ));
      });
    });
    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({ // TODO: Add validations
      id: ['', Validators.compose(
        [Validators.required,
          Validators.pattern(/^[0-9]+(\.?[0-9]+)?$/)])],
      name: ['', Validators.compose(
        [Validators.required,
          Validators.pattern(/^[a-zA-Z ]*$/),
          Validators.minLength(2)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      avatar: ['', Validators.required]
    });
  }

  addEmployee(): void {
    const formValue = this.form.value;
    this.employees.push(new Employee(
      formValue.id,
      formValue.name,
      formValue.email,
      formValue.avatar));
    this.form.reset();
  }

  deleteEmployee(employee): void {
    const removeIndex = this.employees.map(emp => emp.id)
      .indexOf(employee.id);
    this.employees.splice(removeIndex, 1);
  }
}
