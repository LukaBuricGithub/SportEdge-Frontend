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
  selector: 'app-details-order',
  standalone: true,
  imports: [...MaterialModules,RouterModule,RouterLink,RouterOutlet,CommonModule],
  templateUrl: './details-order.component.html',
  styleUrl: './details-order.component.scss'
})
export class DetailsOrderComponent implements OnInit {
  
  constructor(private router:Router,private userService:UserService,private route:ActivatedRoute,private dialog:MatDialog,
  private snackBar:MatSnackBar, private orderService:OrderService) {}


  
  userId!:number;
  user!:UserDTO;
  orderId!:number;
  order!:OrderDTO;
  accessedFromUrl!:string;

  displayedColumns: string[] = ['productName', 'size', 'quantity', 'unitPrice', 'subtotal'];
  dataSource!: MatTableDataSource<any>;
  

  ngOnInit(): void 
  {
      this.route.queryParams.subscribe(params => {
      this.orderId = +params['orderId'];
      this.userId = +params['userId'];
      this.accessedFromUrl= params['accessedFromUrl'];
      console.log('Received orderId:', this.orderId);
      console.log('Received userId:', this.userId);
      console.log('Received route:', this.accessedFromUrl);


      this.orderService.getOrderById(this.orderId).subscribe((x:OrderDTO) => {
        this.order = x;
        this.dataSource = new MatTableDataSource(this.order.orderItems);

        // this.userService.getUserById(this.order.userId).subscribe(y => {
        //   this.user = y;
        // })
      
      
      });

      this.userService.getUserById(this.userId).subscribe((y:UserDTO) => {
        this.user = y;
      });
  
    });
  }



  onBack()
  {
    this.router.navigateByUrl(this.accessedFromUrl);
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

}
