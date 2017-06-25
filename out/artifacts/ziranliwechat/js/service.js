/**
 * Created by 鸠小浅 on 2017/6/2.
 */
(function () {
    'use strict';
    var app = angular.module("naturalForce");
    app.service("artworkService", ["$http", "domain", function ($http, domain) {
        this.getArtList = function (callback) {
            $http({
                url: domain + '/api/artworks',
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        };
        this.loadArtwork = function (artId, callback) {
            $http({
                url: domain + '/api/artworks/' + artId,
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        };
        this.loadArtworkImages = function (artId, callback) {
            $http({
                url: domain + '/api/artwork/images/' + artId,
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        };
        this.buyArtwork = function (artwork, callback) {
            $http({
                url: domain + '/api/artwork-orders/json',
                method: "POST",
                data: artwork
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        };
        //获取所有类型
        this.loadTypes = function (callback) {
            $http({
                url: domain + '/api/allTypes',
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //获取所有材质
        this.loadMaterials = function (callback) {
            $http({
                url: domain + '/api/allMaterials',
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //获取所有尺寸
        this.loadSizes = function (callback) {
            $http({
                url: domain + '/api/allSizes',
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据类型获取艺术品
        this.loadByType = function (type, callback) {
            $http({
                url: domain + '/api/byType/' + type,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据尺寸获取艺术品
        this.loadBySize = function (size, callback) {
            $http({
                url: domain + '/api/bySize/' + size,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据材质获取艺术品
        this.loadByMaterial = function (material, callback) {
            $http({
                url: domain + '/api/byMaterial/' + material,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据类型和材质获取艺术品
        this.loadByTypeAndMaterial = function (type, material, callback) {
            $http({
                url: domain + '/api/byTypeAndMaterial/' + type + "-" + material,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据类型和尺寸获取艺术品
        this.loadByTypeAndSize = function (type, size, callback) {
            $http({
                url: domain + '/api/byTypeAndSize/' + type + "-" + size,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据材质和尺寸获取艺术品
        this.loadByMaterialAndSize = function (material, size, callback) {
            $http({
                url: domain + '/api/byMaterialAndSize/' + material + "-" + size,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
        //根据类型、材质和尺寸获取艺术品
        this.loadByTypeAndMaterialAndSize = function (type, material, size, callback) {
            $http({
                url: domain + '/api/byTypeAndMaterialAndSize/' + type + "-" + material + "-" + size,
                method: "GET"
            }).then(function (data) {
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            })
        };
    }]);
    app.service("wechatUserService", ["$http", "domain", function ($http, domain) {
        //获取个人艺术品订单
        this.getMyArtOrder = function (openid, callback) {
            $http({
                url: domain + '/api/artworkOrders/' + openid,
                method: 'GET'
            }).then(function (data) {
                console.log(data.data);
                if (callback) {
                    callback(data.data, true)
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        };
        //获取个人课程订单
        this.getMyCourseOrder = function (openid, callback) {
            $http({
                url: domain + '/api/courseOrders/' + openid,
                method: 'GET'
            }).then(function (data) {
                console.log(data.data);
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        }
        this.payfinish = function (openid, orderId, callback) {
            $http({
                url: domain + "api/artwork-orders/pay",
                method: "POST",
                data: {
                    openid: openid,
                    orderId: orderId
                }
            }).then(function (result) {
                if (callback) {
                    callback(result.data, true);
                }
            }, function (result) {
                if (callback) {
                    callback(result, false);
                }
            });
        }
    }]);

    app.service("courseService", ["$http", "domain", function ($http, domain) {
        this.getCourseList = function (callback) {
            $http({
                url: domain + '/api/courses',
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        }
        this.loadCourse = function (courseId, callback) {
            $http({
                url: domain + '/api/courses/' + courseId,
                method: "GET"
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        }

        this.buyCourse = function (course, callback) {
            $http({
                url: domain + '/api/course-orders/json',
                method: "POST",
                data: course
            }).then(function (data) {
                console.log(data);
                if (callback) {
                    callback(data.data, true);
                }
            }, function (error) {
                console.log(error);
                if (callback) {
                    callback(error, false);
                }
            });
        }
        this.payfinish = function (openid, orderId, callback) {
            $http({
                url: domain + "api/course-orders/pay",
                method: "POST",
                data: {
                    openid: openid,
                    orderId: orderId
                }
            }).then(function (result) {
                if (callback) {
                    callback(result.data, true);
                }
            }, function (result) {
                if (callback) {
                    callback(result, false);
                }
            });
        }
        this.loadCourseOrderByUser = function (courseId, openid, callback) {
            $http({
                url: domain + "api/course-orders/" + courseId + "/" + openid,
                method: "GET"
            }).then(function (result) {
                if (callback) {
                    callback(result.data, true);
                }
            }, function (result) {
                if (callback) {
                    callback(result, false);
                }
            });
        }
    }])
})();