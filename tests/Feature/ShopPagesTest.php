<?php

test('shop index page renders successfully', function () {
    $this->get('/shop')->assertOk();
});

test('product detail page renders successfully', function () {
    $this->get('/shop/products/1')->assertOk();
});

test('checkout page renders successfully', function () {
    $this->get('/shop/checkout')->assertOk();
});

test('shop confirmation page renders successfully', function () {
    $this->get('/shop/confirmation')->assertOk();
});
