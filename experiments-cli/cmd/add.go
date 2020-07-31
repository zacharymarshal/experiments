package cmd

import (
	"errors"
	"experiments-cli/namegen"
	"fmt"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"

	"github.com/aymerick/raymond"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
	"gopkg.in/yaml.v2"
)

var addCmd = &cobra.Command{
	Use:   "add",
	Short: "Add a new experiment to the project",
	Args: func(cmd *cobra.Command, args []string) error {
		if len(args) < 1 {
			return errors.New("requires a description")
		}
		if len(args) > 1 {
			return errors.New("requires only one description")
		}
		return nil
	},
	Run: addExperiment,
}

func init() {
	rootCmd.AddCommand(addCmd)

	addCmd.Flags().String("templates", "templates/", "Templates directory path")
	addCmd.Flags().String("experiments", "experiments/", "Experiments directory path")
	addCmd.Flags().StringSlice("tools", nil, "Tools this experiment will use")
}

type Tool struct {
	Name string `yaml:"name"`
	Url  string `yaml:"url"`
}

type Experiment struct {
	Name        string   `yaml:"name"`
	Description string   `yaml:"description"`
	Tools       []string `yaml:"tools"`
}

func NewExperiment(description string, tools []string) *Experiment {
	experiment := new(Experiment)
	experiment.Name = namegen.GetRandomName()
	experiment.Description = description
	experiment.Tools = tools

	return experiment
}

func (experiment *Experiment) getTools(urls map[string]string) []*Tool {
	tools := make([]*Tool, 0, len(experiment.Tools))
	for _, t := range experiment.Tools {
		tool := new(Tool)
		tool.Name = t
		tool.Url = urls[t]
		tools = append(tools, tool)
	}

	return tools
}

func addExperiment(cmd *cobra.Command, args []string) {
	readmePath := getTemplate(cmd, "experiment-readme.md")
	tpl, err := raymond.ParseFile(readmePath)
	if err != nil {
		panic(err)
	}
	tpl.RegisterHelper("toolList", func(tools []*Tool) string {
		list := make([]string, 0, len(tools))
		for _, t := range tools {
			if t.Url != "" {
				list = append(list, fmt.Sprintf("[%s](%s)", t.Name, t.Url))
			} else {
				list = append(list, t.Name)
			}
		}
		return strings.Join(list, ", ")
	})

	tools, err := cmd.Flags().GetStringSlice("tools")
	if err != nil {
		panic(err)
	}

	e := NewExperiment(args[0], tools)
	urls := viper.GetStringMapString("urls")
	readme, err := tpl.Exec(map[string]interface{}{
		"name":        e.Name,
		"description": e.Description,
		"tools":       e.getTools(urls),
	})
	if err != nil {
		panic(err)
	}
	config, err := yaml.Marshal(&e)
	if err != nil {
		panic(err)
	}

	err = os.Mkdir(getExperimentsDir(cmd, e.Name), 0755)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(getExperimentsDir(cmd, e.Name, "experiment.yml"), config, 0644)
	if err != nil {
		panic(err)
	}

	err = ioutil.WriteFile(getExperimentsDir(cmd, e.Name, "README.md"), []byte(readme), 0644)
	if err != nil {
		panic(err)
	}

	fmt.Println("Created new experiment", getExperimentsDir(cmd, e.Name))
}

func getExperimentsDir(cmd *cobra.Command, files ...string) string {
	workDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	experimentsDir, err := cmd.Flags().GetString("experiments")
	if err != nil {
		panic(err)
	}
	path := append([]string{workDir, experimentsDir}, files...)
	return filepath.Join(path...)
}

func getTemplate(cmd *cobra.Command, file string) string {
	workDir, err := os.Getwd()
	if err != nil {
		panic(err)
	}
	templatesDir, err := cmd.Flags().GetString("templates")
	if err != nil {
		panic(err)
	}
	return filepath.Join(workDir, templatesDir, file)
}
