$(function () {
	'use strict';

	module('scrollspy plugin')

	test('should be defined on jquery object', function () {
		ok($(document.body).scrollspy, 'scrollspy method is defined')
	})

	module('scrollspy', {
		setup: function () {
			// Run all tests in noConflict mode -- it's the only way to ensure that the plugin works in noConflict mode
			$.fn.bootstrapScrollspy = $.fn.scrollspy.noConflict()
		},
		teardown: function () {
			$.fn.scrollspy = $.fn.bootstrapScrollspy
			delete $.fn.bootstrapScrollspy
		}
	})

	test('should provide no conflict', function () {
		strictEqual($.fn.scrollspy, undefined, 'scrollspy was set back to undefined (org value)')
	})

	test('should return jquery collection containing the element', function () {
		var $el = $('<div/>')
		var $scrollspy = $el.bootstrapScrollspy()
		ok($scrollspy instanceof $, 'returns jquery collection')
		strictEqual($scrollspy[0], $el[0], 'collection contains element')
	})

	// Does not work properly ATM, #13500 will fix this
	test('should switch "is-active" class on scroll', function () {
		var topbarHTML = '<div class="Topbar">'
				+ '<div class="Topbar-inner">'
					+ '<div class="Container">'
						+ '<ul class="Nav">'
							+ '<li><a href="#detail">Detail</a></li>'
							+ '<li><a href="#masthead">Overview</a></li>'
						+ '</ul>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		var $topbar = $(topbarHTML).bootstrapScrollspy()

		ok($topbar.find('.is-active', true))
	})

	test('should only switch "active" class on current target', function () {
		stop()

		var sectionHTML = '<div id="root" class="is-active">'
				+ '<div class="Topbar">'
					+ '<div class="Topbar-inner">'
						+ '<div class="Container" id="ss-target">'
							+ '<ul class="Nav">'
								+ '<li><a href="#masthead">Overview</a></li>'
								+ '<li><a href="#detail">Detail</a></li>'
							+ '</ul>'
						+ '</div>'
					+ '</div>'
				+ '</div>'
				+ '<div id="scrollspy-example" style="height: 100px; overflow: auto;">'
					+ '<div style="height: 200px;">'
						+ '<h4 id="masthead">Overview</h4>'
						+ '<p style="height: 200px">'
							+ 'Ad leggings keytar, brunch id art party dolor labore.'
						+ '</p>'
					+ '</div>'
					+ '<div style="height: 200px;">'
						+ '<h4 id="detail">Detail</h4>'
						+ '<p style="height: 200px">'
							+ 'Veniam marfa mustache skateboard, adipisicing fugiat velit pitchfork beard.'
						+ '</p>'
					+ '</div>'
				+ '</div>'
			+ '</div>'
		var $section = $(sectionHTML).appendTo('#qunit-fixture')

		var $scrollspy = $section
				.show()
				.find('#scrollspy-example')
				.bootstrapScrollspy({ target: '#ss-target' })

		$scrollspy.on('scroll.bs.scrollspy', function () {
			ok($section.hasClass('is-active'), '"is-active" class still on root node')
			start()
		})

		$scrollspy.scrollTop(350)
	})

	test('middle Navigation option correctly selected when large offset is used', function () {
		stop()

		var sectionHTML = '<div id="header" style="height: 500px;"></div>'
				+ '<nav id="Navigation" class="Navbar">'
					+ '<ul class="Nav Navbar-Nav">'
						+ '<li class="is-active"><a id="one-link" href="#one">One</a></li>'
						+ '<li><a id="two-link" href="#two">Two</a></li>'
						+ '<li><a id="three-link" href="#three">Three</a></li>'
					+ '</ul>'
				+ '</nav>'
				+ '<div id="content" style="height: 200px; overflow-y: auto;">'
					+ '<div id="one" style="height: 500px;"></div>'
					+ '<div id="two" style="height: 300px;"></div>'
					+ '<div id="three" style="height: 10px;"></div>'
				+ '</div>'
		var $section = $(sectionHTML).appendTo('#qunit-fixture')
		var $scrollspy = $section
				.show()
				.filter('#content')

		$scrollspy.bootstrapScrollspy({ target: '#Navigation', offset: $scrollspy.position().top })

		$scrollspy.on('scroll.bs.scrollspy', function () {
			ok(!$section.find('#one-link').parent().hasClass('is-active'), '"is-active" class removed from first section')
			ok($section.find('#two-link').parent().hasClass('is-active'), '"is-active" class on middle section')
			ok(!$section.find('#three-link').parent().hasClass('is-active'), '"is-active" class not on last section')
			start()
		})

		$scrollspy.scrollTop(550)
	})

	test('should add the is-active class to the correct element', function () {
		var NavbarHtml = '<nav class="Navbar">'
				+ '<ul class="Nav">'
					+ '<li id="li-1"><a href="#div-1">div 1</a></li>'
					+ '<li id="li-2"><a href="#div-2">div 2</a></li>'
				+ '</ul>'
			+ '</nav>'
		var contentHtml = '<div class="content" style="overflow: auto; height: 50px">'
				+ '<div id="div-1" style="height: 100px; padding: 0; margin: 0">div 1</div>'
				+ '<div id="div-2" style="height: 200px; padding: 0; margin: 0">div 2</div>'
			+ '</div>'

		$(NavbarHtml).appendTo('#qunit-fixture')
		var $content = $(contentHtml)
			.appendTo('#qunit-fixture')
			.bootstrapScrollspy({ offset: 0, target: '.Navbar' })

		var testElementIsActiveAfterScroll = function (element, target) {
			var deferred = $.Deferred()
			var scrollHeight = Math.ceil($content.scrollTop() + $(target).position().top)
			stop()
			$content.one('scroll', function () {
				ok($(element).hasClass('is-active'), 'target:' + target + ', element' + element)
				start()
				deferred.resolve()
			})
			$content.scrollTop(scrollHeight)
			return deferred.promise()
		}

		$.when(testElementIsActiveAfterScroll('#li-1', '#div-1'))
			.then(function () { return testElementIsActiveAfterScroll('#li-2', '#div-2') })
	})

})
