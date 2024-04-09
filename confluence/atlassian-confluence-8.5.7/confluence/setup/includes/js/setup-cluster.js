/**
 * @module confluence/setup/setup-cluster
 */
define('confluence/setup/setup-cluster', [
], function(
) {
    'use strict';

    return function($) {
        // Hides or reveals the multicast address field when the user toggles
        // the 'generate automatically' checkbox
        $('#cluster-auto-address').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-address-field').slideUp();
            } else {
                $('#cluster-address-field').slideDown();
            }
        });

        $('#useMulticast').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-tcpip-group').slideUp(function() {
                    $('#cluster-aws-group').slideUp(function() {
                        $('#cluster-multicast-group').slideDown();
                    });
                });
            }
        });

        $('#useTcpIp').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-multicast-group').slideUp(function() {
                    $('#cluster-aws-group').slideUp(function() {
                        $('#cluster-tcpip-group').slideDown();
                    });
                });
            }
        });

        $('#useAws').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-multicast-group').slideUp(function() {
                    $('#cluster-tcpip-group').slideUp(function() {
                        $('#cluster-aws-group').slideDown();
                    });
                });
            }
        });

        $('#useIamRole').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-aws-secretkey').slideUp(function() {
                    $('#cluster-aws-iamrole').slideDown();
                });
            }
        });

        $('#useSecretKey').change(function() {
            if ($(this).is(':checked')) {
                $('#cluster-aws-iamrole').slideUp(function() {
                    $('#cluster-aws-secretkey').slideDown();
                });
            }
        });

        $('#clusteringEnabled').change(function() {
            if ($(this).is(':checked')) {
                $('form[name=\'clusterform\']').slideDown();
                $('#skip-button').hide();
            }
        });

        $('#clusteringDisabled').change(function() {
            if ($(this).is(':checked')) {
                $('form[name=\'clusterform\']').slideUp();
                $('#skip-button').show();
            }
        });

        $('#clusterName,#clusterHome').on('blur', function() {
            var $error = $(this).siblings('div.error');
            if ($(this).val().length === 0) {
                $error.removeClass('hidden');
            } else {
                $error.addClass('hidden');
            }
        });

        $('.start-setup-button').on('click', function(e) {
            var that = this;

            if (!that.isBusy()) {
                that.busy();

                $('div.aui-message-error').addClass('hidden');

                if ($('#clusterName').val().length === 0 || $('#clusterHome').val().length === 0) {
                    $('div.error').removeClass('hidden');
                    that.idle();
                } else {
                    $('form[name=\'clusterform\']').submit();
                }
            }

            e.preventDefault();
        });

        $('#skip-button').on('click', function() {
            $('#newCluster').val('skipCluster');

            $('form[name=\'clusterform\']').submit();
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/setup/setup-cluster', function(Cluster) {
    'use strict';

    require('ajs').toInit(Cluster);
});
