<?php

test('booking index page renders successfully', function () {
    $this->get('/booking')->assertOk();
});

test('hotel detail page renders successfully', function () {
    $this->get('/booking/hotels/1')->assertOk();
});

test('car detail page renders successfully', function () {
    $this->get('/booking/cars/1')->assertOk();
});

test('booking confirmation page renders successfully', function () {
    $this->get('/booking/confirmation')->assertOk();
});
