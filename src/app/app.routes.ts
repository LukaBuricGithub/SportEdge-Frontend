import { Routes } from '@angular/router';
import { AdminGuard } from './services/AuthenticationServices/AdminGuard';
import { CustomerGuard } from './services/AuthenticationServices/CustomerGuard';


import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { AdministratorBrandContentComponent } from './components/administrator-brand-content/administrator-brand-content.component';
import { CreateBrandComponent } from './components/create-brand/create-brand.component';
import { DetailsBrandComponent } from './components/details-brand/details-brand.component';
import { UpdateBrandComponent } from './components/update-brand/update-brand.component';

import { AdministratorCategoryContentComponent } from './components/administrator-category-content/administrator-category-content.component';
import { CreateCategoryComponent } from './components/create-category/create-category.component';
import { DetailsCategoryComponent } from './components/details-category/details-category.component';
import { UpdateCategoryComponent } from './components/update-category/update-category.component';

import { AdministratorUserContentComponent } from './components/administrator-user-content/administrator-user-content.component';
import { DetailsUserComponent } from './components/details-user/details-user.component';
import { UpdateUserComponent } from './components/update-user/update-user.component';

import { DetailsOrderComponent } from './components/details-order/details-order.component';
import { AdministratorOrderContentComponent } from './components/administrator-order-content/administrator-order-content.component';

import { AdministratorProductContentComponent } from './components/administrator-product-content/administrator-product-content.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { DetailsProductComponent } from './components/details-product/details-product.component';
import { UploadProductImageComponent } from './components/upload-product-image/upload-product-image.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { UpdateProductVariationsQuantityComponent } from './components/update-product-variations-quantity/update-product-variations-quantity.component';

import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { IndexPageComponent } from './components/index-page/index-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { InformationPageComponent } from './components/information-page/information-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { ThankYouMessageCustomerServiceComponent } from './components/thank-you-message-customer-service/thank-you-message-customer-service.component';
import { NotAuthorizedMessageComponent } from './components/not-authorized-message/not-authorized-message.component';

import { ShopProductsListComponent } from './components/shop-products-list/shop-products-list.component';
import { ShopProductDetailsComponent } from './components/shop-product-details/shop-product-details.component';

import { ShopUserDetailsComponent } from './components/shop-user-details/shop-user-details.component';
import { ShopUserUpdateComponent } from './components/shop-user-update/shop-user-update.component';
import { ShopShoppingCartComponent } from './components/shop-shopping-cart/shop-shopping-cart.component';

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
            { path: '', component: IndexPageComponent },
            { path: 'index', component: IndexPageComponent },
            { path: 'login', component: LoginComponent },
            { path: 'sign-up', component: SignUpComponent },
            { path: 'forgot-password', component: ForgotPasswordComponent },
            { path: 'reset-password', component: ResetPasswordComponent },
            { path: 'about-us', component: AboutPageComponent },
            { path: 'information', component: InformationPageComponent},
            { path: 'contact', component: ContactPageComponent },
            { path: 'thank-you-message', component: ThankYouMessageCustomerServiceComponent },
            { path: 'access-denied', component: NotAuthorizedMessageComponent },
            { path: 'search', component: ShopProductsListComponent },
            { path: 'product-details' , component: ShopProductDetailsComponent }

        ]
    },
    {
        path:'customer',
        component:MainLayoutComponent,
        canActivate: [CustomerGuard],
        children: [
            { path: '', component: ShopUserDetailsComponent },
            { path: 'profile', component: ShopUserDetailsComponent },
            { path: 'update-profile', component: ShopUserUpdateComponent },
            { path: 'shopping-cart', component: ShopShoppingCartComponent }
        ]
    },
    {
        path:'admin',
        component:AdminLayoutComponent,
        canActivate: [AdminGuard],
        children: [
            { path: '', component: AdministratorBrandContentComponent },
            { path: 'index', component: IndexPageComponent },
            { path: 'brands', component: AdministratorBrandContentComponent},
            { path: 'create-brand',component: CreateBrandComponent},
            { path: 'details-brand', component: DetailsBrandComponent },
            { path: 'update-brand', component: UpdateBrandComponent },
            { path: 'categories', component: AdministratorCategoryContentComponent },
            { path: 'create-category', component: CreateCategoryComponent },
            { path: 'details-category', component: DetailsCategoryComponent },
            { path: 'update-category', component: UpdateCategoryComponent },
            { path: 'users', component: AdministratorUserContentComponent },
            { path: 'details-user', component:DetailsUserComponent },
            { path: 'update-user', component: UpdateUserComponent },
            { path: 'orders', component: AdministratorOrderContentComponent },
            { path: 'details-order', component: DetailsOrderComponent },
            { path: 'products', component: AdministratorProductContentComponent },
            { path: 'create-product', component:CreateProductComponent },
            { path: 'details-product', component: DetailsProductComponent },
            { path: 'upload-product-images', component: UploadProductImageComponent },
            { path: 'update-product', component: UpdateProductComponent },
            { path: 'update-product-variations' , component: UpdateProductVariationsQuantityComponent }
        ]
    }
];
