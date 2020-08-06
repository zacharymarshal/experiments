package main

import (
	"encoding/xml"
	"fmt"
	"io"
	"io/ioutil"
	"net/http"
	"os"
	"path"
	"path/filepath"

	"github.com/gosimple/slug"
	"gopkg.in/yaml.v2"
)

type Books struct {
	Books []Book `xml:"channel>item"`
}

type Book struct {
	Title    string `xml:"title" yaml:"title"`
	Author   string `xml:"author_name" yaml:"author"`
	ImageUrl string `xml:"book_large_image_url" yaml:"-"`
	Cover    string `yaml:"cover"`
	ReadIn   int    `yaml:"read_in"`
}

func main() {
	res, err := http.Get("https://www.goodreads.com/review/list_rss/91614798?shelf=www")
	if err != nil {
		panic(err)
	}

	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		panic(err)
	}

	var books Books
	xml.Unmarshal(body, &books)

	for _, book := range books.Books {
		slug := slug.Make(book.Title)
		cover := slug + filepath.Ext(book.ImageUrl)

		imgpath := path.Join("images", cover)
		err := DownloadImage(book.ImageUrl, imgpath)
		if err != nil {
			panic(err)
		}
		fmt.Println("Downloaded img: " + imgpath)

		book.Cover = cover
		config, err := yaml.Marshal(&book)
		if err != nil {
			panic(err)
		}

		bookpath := path.Join("books", slug+".md")
		fmt.Println("Creating " + bookpath)
		err = ioutil.WriteFile(bookpath, []byte("---\n"+string(config)+"---\n"), 0644)
		if err != nil {
			panic(err)
		}
	}
}

func DownloadImage(imgurl string, imgpath string) error {
	res, err := http.Get(imgurl)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	img, err := os.Create(imgpath)
	if err != nil {
		return err
	}
	defer img.Close()

	_, err = io.Copy(img, res.Body)
	if err != nil {
		return err
	}

	return nil
}
