import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent, ConfirmDialogData } from '../confirm-dialog/confirm-dialog.component';
import { UserService } from '../../services/user.service';
import { UserDTO } from '../../models/UserDTO';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { OrderDTO } from '../../models/OrderDTO';
import { OrderService } from '../../services/order.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-administrator-order-content',
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './administrator-order-content.component.html',
  styleUrl: './administrator-order-content.component.scss'
})
export class AdministratorOrderContentComponent implements OnInit {

  constructor(private router:Router,private userService:UserService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar, private orderService:OrderService) {}
  
  //userId!:number;
  //user!:UserDTO;

  orderId!:number;

  displayedColumns: string[] = ['id', 'date', 'actions'];
  dataSource!: MatTableDataSource<OrderDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  orders:OrderDTO[] = [];


  ngOnInit(): void 
  {
    this.orderService.getAllOrders().subscribe((x:OrderDTO[]) => {
      this.orders = x;
      this.dataSource = new MatTableDataSource(x);

      if(this.paginator && this.sort)
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



  goToDetails(orderId:number,userId:number) : void 
  {
   this.router.navigate(['/admin/details-order'], {
        queryParams: {orderId:orderId,userId:userId,accessedFromUrl:'/admin/orders'}
      });
  }

}
