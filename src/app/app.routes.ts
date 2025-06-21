import { Routes } from '@angular/router';


import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AdministratorBrandContentComponent } from './components/administrator-brand-content/administrator-brand-content.component';
import { CreateBrandComponent } from './components/create-brand/create-brand.component';
import { DetailsBrandComponent } from './components/details-brand/details-brand.component';
import { UpdateBrandComponent } from './components/update-brand/update-brand.component';
import { AdministratorCategoryContentComponent } from './components/administrator-category-content/administrator-category-content.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { DetailsCategoryComponent } from './components/details-category/details-category.component';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { ThankYouMessageCustomerServiceComponent } from './components/thank-you-message-customer-service/thank-you-message-customer-service.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'shop'
    },
    {
        path:'shop',
        component:MainLayoutComponent,
        children: [
            { path: '', component: IndexPageComponent},
            { path: 'index', component: IndexPageComponent},
            { path: 'login', component: LoginComponent},
            { path: 'sign-up', component: SignUpComponent},
            { path: 'forgot-password', component: ForgotPasswordComponent},
            { path: 'reset-password', component: ResetPasswordComponent},
            { path: 'about-us', component:AboutPageComponent},
            { path: 'information', component:InformationPageComponent},
            { path: 'contact', component:ContactPageComponent },
            { path: 'thank-you-message', component:ThankYouMessageCustomerServiceComponent }
        ]
    },
    {
        path:'admin',
        component:AdminLayoutComponent,
        children: [
            { path: '', component: AdministratorBrandContentComponent},
            { path: 'index', component: IndexPageComponent },
            { path: 'brands', component: AdministratorBrandContentComponent},
            { path: 'create-brand',component:CreateBrandComponent},
            { path: 'details-brand', component:DetailsBrandComponent },
            { path: 'update-brand', component:UpdateBrandComponent },
            { path: 'categories', component: AdministratorCategoryContentComponent },
            { path: 'create-category', component: CreateCategoryComponent },
            { path: 'details-category', component:DetailsCategoryComponent }
            
        ]
    }
];
