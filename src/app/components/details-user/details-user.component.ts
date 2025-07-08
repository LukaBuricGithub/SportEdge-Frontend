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
  selector: 'app-details-user',
  standalone:true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './details-user.component.html',
  styleUrl: './details-user.component.scss'
})

export class DetailsUserComponent implements OnInit {
  
  constructor(private router:Router,private userService:UserService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar, private orderService:OrderService) {}
  
  userId!:number;
  user!:UserDTO;

  displayedColumns: string[] = ['id', 'date', 'actions'];
  dataSource!: MatTableDataSource<OrderDTO>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  orders:OrderDTO[] = [];


  ngOnInit(): void 
  {
      this.route.queryParams.subscribe(params => {
      this.userId = +params['userId'];
      console.log('Received userId:', this.userId);

      this.userService.getUserById(this.userId).subscribe(x => {
        this.user = x
      });
    });

    this.orderService.getOrdersForUser(this.userId).subscribe((y:OrderDTO[]) => {
      console.log('Orders for user:', y);
      
      this.orders = y;
      this.dataSource = new MatTableDataSource(y);

      if(this.paginator && this.sort)
      {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }


  onUpdate(userId:number)
  {
    this.router.navigate(['/admin/update-user'], {
        queryParams: {userId:userId}
      });
  }

  onBack() : void 
  {
    this.router.navigate(['/admin/users']);
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
        queryParams: {orderId:orderId,userId:userId,accessedFromUrl:'/admin/details-user?userId='+this.userId}
      });
}

downloadOrderPdf(orderId: number) 
{
  this.orderService.getOrderById(orderId).subscribe(order => {
    this.generatePdf(order,this.user);
  });
}



  generatePdf(order: OrderDTO, user: UserDTO): void 
  {
  const doc = new jsPDF();

  const img = new Image();
  img.src = "/images/SportEdge-Logo-PNG.png";

  img.onload = () => {
    doc.addImage(img, 'PNG', 14, 10, 60, 25);

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Order Receipt', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });

    const formattedDate = new Date(order.createdAt).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Order ID: ${order.id}`, 14, 55);
    doc.text(`Date: ${formattedDate}`, 14, 62);
    doc.text(`Customer: ${user.firstName} ${user.lastName}`, 14, 69);
    doc.text(`Customer email: ${user.email}`, 14, 76);
    doc.text(`Shipping Address: ${order.userAddress}, ${order.userCity}, ${order.userCountry}`, 14, 83);

    const itemRows = order.orderItems.map(item => [
      item.productName,
      item.sizeOptionName,
      item.quantity,
      `${item.unitPrice.toFixed(2)} €`,
      `${item.subtotalPrice.toFixed(2)} €`
    ]);

    autoTable(doc, {
      head: [['Product', 'Size', 'Qty', 'Unit Price', 'Subtotal']],
      body: itemRows,
      startY: 90,
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 10, cellPadding: 3 },
      margin: { bottom: 30 },
      didDrawPage: (data) => {
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          'Thank you for your order with SportEdge!',
          doc.internal.pageSize.getWidth() / 2,
          pageHeight - 15,
          { align: 'center' }
        );

        const pageNumber = doc.getNumberOfPages(); 
        doc.text(`Page ${pageNumber}`, doc.internal.pageSize.getWidth() - 20, pageHeight - 15);
      },
    });

    const finalY = (doc as any).lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${order.totalPrice.toFixed(2)} €`, 14, finalY + 10);

    doc.save(`Order_${order.id}.pdf`);
  };

  img.onerror = (err) => {
    console.error('Error loading logo:', err);
  };
}




  

  onDelete(userId:number): void
  {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
        confirmText: 'Delete',
        cancelText: 'Cancel'
      } as ConfirmDialogData
    });

    
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          console.log('User deleted successfully:',response);
          this.router.navigate(['/admin/users']);
        },
        error: (error) => {

          let errorMessage = 'An unknown error occurred.';

          switch(error.status) 
          {
            case 400:
              errorMessage = error?.error?.message || 'Cannot delete user because it has related objects.';
              break;
            default:
               errorMessage = error?.error?.message || 'Unexpected error occurred.';
              break;
          }


          console.error('Failed to delete user:', error);
          this.snackBar.open(errorMessage, 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar']
          });
        }

      });
    }
  });
  }

}
