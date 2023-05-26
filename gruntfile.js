module.exports = grunt => {
    //const mozjpeg = require('imagemin-mozjpeg');
	grunt.initConfig({
		imagemin: {
			dynamic: {
				files: [{
					expand: true,
					cwd: 'src/assets/images-before-optimisation/',
					src: '**/*.{gif,GIF,jpg,JPG,png,PNG}',
					dest: 'src/assets/home/images/'
				}]
			}
        },
        
        uglify: {
            options: {  
                compress: true  
            },  
            my_target: {
              files: [{
                //expand: true,
                //cwd: 'C:/xorvalue/KAKOO/kakoo-back-end/target/classes/static/',
                src: 'C:/xorvalue/KAKOO/kakoo-back-end/target/classes/static/**/*.js',
                dest: 'C:/xorvalue/KAKOO/kakoo-back-end/target/classes/uglify/main.min.js'
                //ext: '.min.js'
              }]
            }
          },
          cssmin: {
            target: {
              files: [{
                expand: true,
                cwd: 'src/assets/home/css',
                src: ['*.css', '!*.min.css'],
                dest: 'src/assets/home/css',
                ext: '.min.css'
              }]
            }
          }
	});


    //grunt.loadTasks('tasks');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['imagemin', 'grunt-contrib-uglify']);
  
};