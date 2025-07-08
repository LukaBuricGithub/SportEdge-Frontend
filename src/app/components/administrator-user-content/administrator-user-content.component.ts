import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { RouterLink, RouterOutlet, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/UserDTO';



@Component({
  selector: 'app-administrator-user-content',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './administrator-user-content.component.html',
  styleUrl: './administrator-user-content.component.scss'
})
export class AdministratorUserContentComponent implements OnInit {
  
  displayedColumns: string[] = ['name', 'email', 'actions'];

  dataSource!: MatTableDataSource<UserDTO>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  users: UserDTO[] = [];

  constructor(private router:Router,private userService:UserService) {}

    
  ngOnInit(): void 
  {
       this.userService.getAllUsers().subscribe((x:UserDTO[]) => {
            console.log('Users received from API:', x);
            this.users = x;
            this.dataSource = new MatTableDataSource(x);
    
            if (this.paginator && this.sort) 
            {
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            }
      });
  }



  applyFilter(event: Event) 
  {
      const filterValue = (event.target as HTMLInputElement).value;
      this.dataSource.filter = filterValue.trim().toLowerCase();
  
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
  }
  
  goToDetails(userId: number) 
  {
      this.router.navigate(['/admin/details-user'], {
        queryParams: {userId:userId}
      });
  }

}