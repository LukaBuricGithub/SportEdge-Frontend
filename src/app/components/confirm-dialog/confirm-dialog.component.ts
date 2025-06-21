import { Component, Inject } from '@angular/core';
import { MaterialModules } from '../../shared-files/material.imports';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone:true,
  imports: [...MaterialModules],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})

export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}
}
